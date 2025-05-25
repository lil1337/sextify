import { KeyContainer, WidevineSession } from 'lib/widevine';
import { getFileCdnUrl } from '../applicationEndpoints/getFileCdnUrl';
import { getSeekTable } from '../applicationEndpoints/getSeekTable';
import EndpointsBase from './EndpointsBase';
import { getWidevineLicense } from '../applicationEndpoints/getWidevineLicense';


import { getPlayplayLicense } from '../applicationEndpoints/getPlayplayLicense';
import { encodePlayplayLicenseRequest, parsePlayplayLicenseResponse } from 'lib/playplay';
import { SpotifyApi } from '../spotify';
import { SpotifyCdnFile } from '../types/SpotifyCdnFile';
import { defaultWidevineDevice } from 'lib/widevine/defaultWidevineDevice';
import { Readable } from 'stream';
import { createPPStreamDecryptor } from 'lib/playplay/createPlayplayStreamDecryptor';
import { unlink, writeFile } from 'fs/promises';
import { ffmpegStream } from 'lib/ffmpeg/ffmpegDecryptStream';
import { ID3Metadata } from 'lib/ffmpeg/types/ID3Metadata';
import { QuickTimeMetadata } from 'lib/ffmpeg/types/QuickTimeMetadata';
import { spotifyMetadataToQuickTime } from 'lib/ffmpeg/spotifyMetadataToQuickTime';
import { SpotifyTrack } from '../types/Spotify';
import { resolve } from 'path';
import { tmpdir } from 'os';
import { randomUUID } from 'crypto';
import { UnPlayplayLike } from 'lib/playplay/types/UnPlayplayLike';
import { SeekTable } from '../types/SeekTable';
import { quickMapQueue, streamQuickMapQueue } from '../stuff/roundQueue';
import { PathfinderClient } from '../types/Pathfinder/PathfinderClient';
import { fetchRetry } from '../stuff/fetchRetry';

export type DownloadOptions = {
    as?: "file" | "stream",

    ffmpeg?: {
        verbose?: boolean,
        overrideArgs?: string[],
        modifyArgs?: (args: string[]) => string[],
        ffmpegPath?: string,
        format?: string,
    },

    includeMetadata?: boolean,
    includeAlbumArt?: boolean,
    concurrency?: number,
}

type ApiWithTrackEndpoints = unknown & {
        makeRequest: typeof SpotifyApi.prototype.makeRequest,
        ensureAuth: typeof SpotifyApi.prototype.ensureAuth,
        ensureClientToken: typeof SpotifyApi.prototype.ensureClientToken,
        
        tracks: {
            get: typeof SpotifyApi.prototype.tracks.get,
            credits: typeof SpotifyApi.prototype.tracks.credits
        }
} & PathfinderClient

export default class CdnEndpoints extends EndpointsBase {

    device: { privateKey: Buffer, clientId: Buffer };
    unplayplay: UnPlayplayLike

    api: ApiWithTrackEndpoints = undefined;


    constructor(api: ApiWithTrackEndpoints, widevineDevice?: { privateKey: Buffer, clientId: Buffer }, unplayplay?: UnPlayplayLike) {
        
        super(api);
        this.api = api;

        this.device = widevineDevice || defaultWidevineDevice;
        this.unplayplay = unplayplay;
    }


    public async fetch(file: SpotifyCdnFile, trackId: string, targetPath: string, options?: DownloadOptions): Promise<void>;
    public async fetch(file: SpotifyCdnFile, trackId: string, options?: DownloadOptions): Promise<Readable>;
    public async fetch(file: SpotifyCdnFile, trackId: string, oops?: string | DownloadOptions, oopsie?: DownloadOptions) {

        let targetPath: string = undefined, o: DownloadOptions = undefined;
        let tmpAlbumArtPath: string = undefined;
        if (typeof oops === "string") targetPath = oops;
        if (typeof oops === "object") o = oops;
        if (typeof oopsie === "object") o = oopsie;

        let fileMetadata: Partial<QuickTimeMetadata & ID3Metadata & { coverPath?: string }> = undefined;



        if (o?.includeMetadata ?? true) {
            let track: SpotifyTrack = await this.api.tracks.get(trackId);
            if (o?.includeAlbumArt ?? true) {
                tmpAlbumArtPath = resolve(tmpdir(), `${randomUUID()}-${track.id}.jpg`);
                await writeFile(
                    tmpAlbumArtPath,
                    await fetchRetry(track.album.images[0].url).then(r => r.body).then(r => Readable.fromWeb(r))
                );
            }
            fileMetadata = spotifyMetadataToQuickTime(
                track,
                await this.api.tracks.credits(trackId),
                tmpAlbumArtPath
            );
        }

        try {

            let resolved = await this.resolveToUrls(file.file_id);

            if (file.format.startsWith("OGG")) {
                let decryptionKey = await this.getFilePlayplayDecryptionKey(file.file_id);

                let remoteStream = await fetchRetry(resolved.cdnurl[0]).then(r => Readable.fromWeb(r.body));
                let stream = remoteStream.pipe(createPPStreamDecryptor(Buffer.from(decryptionKey)));

                if (!targetPath) {
                    if (tmpAlbumArtPath) await unlink(tmpAlbumArtPath);
                    return stream as Readable;
                }
                else {
                    await writeFile(targetPath, stream);
                    if (tmpAlbumArtPath) await unlink(tmpAlbumArtPath);

                    return;
                }

                // TODO: OGG metadata??

            }
            else if (file.format.startsWith("MP4")) {

                let seekTable = await this.getSeekTable(file.file_id);
                let decryptionKey = await this.getPsshWidevineDecryptionKey(Buffer.from(seekTable.pssh_widevine ?? seekTable.pssh, "base64"), this.device);

                let resolved = await this.resolveToUrls(file.file_id);

                // download from multiple cdns, in parralel, with range requests (as if we are streaming from the official client)
                // so spotify is a little bit less suspicious

                const perCdn = resolved.cdnurl.reduce((previous, current) => {
                    const [subdomain, ...rest] = new URL(current).hostname.split(".");
                    let name = subdomain.startsWith("audio") ? ["audio", subdomain.split("-")[1]].join("-") : [subdomain, ...rest].join(".");

                    return { ...previous, [name]: previous[name] ? [...previous[name], current] : [current] }
                }, {} as Record<string, string[]>);
                const urlsToUse = Object.values(perCdn).filter(e => e.length).map(e => e[0]);

                const offsets = [[0, seekTable.offset - 1]];
                seekTable.segments.map(([seg]) =>
                    offsets.push([offsets[offsets.length - 1][1] + 1, offsets[offsets.length - 1][1] + seg])
                );

                let remoteStream = streamQuickMapQueue(quickMapQueue(
                    offsets.map((o, i) => [urlsToUse[i % urlsToUse.length], ...o]) as [string, number, number][],
                    ([url, start, end], index, groupIndex, offsets) => fetchRetry(url, { headers: { range: `bytes=${start}-${end}` } })
                        .then(r => r.blob()).then(r => r.arrayBuffer()).then(r => {
                            // console.log(`${index}/${offsets.length} [${start} - ${end}] ${new URL(url).hostname} ${groupIndex}`);
                            return Buffer.from(r);
                        }),
                    { concurrency: o?.concurrency ?? 5, autostart: false }
                )).stream;

                if (!targetPath) return ffmpegStream(remoteStream, {
                    decryptionKey: Buffer.from(decryptionKey[0].key, "hex"),
                    as: "stream", format: o?.ffmpeg?.format ?? "mp3", // TODO: im sorry i wanted something streamable and this is the first thing that came to mind
                    overrideArgs: o?.ffmpeg?.overrideArgs,
                    modifyArgs: o?.ffmpeg?.modifyArgs,
                    ffmpegPath: o?.ffmpeg?.ffmpegPath,
                    verbose: o?.ffmpeg?.verbose, removeTmpAlbumArt: true,
                    metadata: fileMetadata
                });
                else return await ffmpegStream(remoteStream, targetPath, {
                    decryptionKey: Buffer.from(decryptionKey[0].key, "hex"),
                    as: "file",
                    overrideArgs: o?.ffmpeg?.overrideArgs,
                    modifyArgs: o?.ffmpeg?.modifyArgs,
                    ffmpegPath: o?.ffmpeg?.ffmpegPath,
                    // ffmpeg is so fucking stupid that it produces unplayable (at least via quicklook) m4a files unless you use ipod demuxer
                    format: (targetPath.endsWith(".m4a") && (!o?.ffmpeg?.format || o?.ffmpeg?.format == "m4a")) ? "ipod" : o?.ffmpeg?.format,
                    verbose: o?.ffmpeg?.verbose, removeTmpAlbumArt: true,
                    metadata: fileMetadata
                });

            }
            else throw new Error(`Unsupported format: ${file.format}`);
        }
        catch (e) {
            if (tmpAlbumArtPath) await unlink(tmpAlbumArtPath);
            throw e;
        }
    }

    public async resolveToUrls(fileId: string) {
        return getFileCdnUrl(this, fileId);
    }

    public async getSeekTable(fileId: string) {
        
        return getSeekTable(this, fileId);
    }

    public async getPsshWidevineDecryptionKey(pssh: Buffer, device?: { privateKey: Buffer, clientId: Buffer }): Promise<KeyContainer[]> {
        if (!device) device = this.device;

        let session = new WidevineSession({ privateKey: device.privateKey, identifierBlob: device.clientId }, pssh);
        let challenge = session.createLicenseRequest();
        let licenseResponse = await getWidevineLicense(await this.api.ensureAuth(), "audio", challenge);
        return session.parseLicense(licenseResponse);
    }

    public async getFileWidevineDecryptionKey(fileId: string, device?: { privateKey: Buffer, clientId: Buffer }): Promise<KeyContainer[]> {
        let seekTable = await this.getSeekTable(fileId);
        return this.getPsshWidevineDecryptionKey(Buffer.from(seekTable.pssh_widevine ?? seekTable.pssh, "base64"), device);
    }

    public async getFilePlayplayDecryptionKey(fileId: string): Promise<Uint8Array> {

        if (!this.unplayplay) throw new Error("You need to install unplayplay separately to download OGG files (git.gay/PwLDev/unplayplay)");

        let playplayLicenseResponse = await getPlayplayLicense(
            await this.api.ensureAuth(),
            fileId,
            encodePlayplayLicenseRequest(this.unplayplay.token)
        ).then(parsePlayplayLicenseResponse);

        return this.unplayplay.deobfuscateKey(
            Buffer.from(fileId, "hex"),
            playplayLicenseResponse.obfuscatedKey,
        );
    }



}
