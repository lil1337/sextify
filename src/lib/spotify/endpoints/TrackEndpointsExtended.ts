
import type { SpotifyApi, SpotifyFormats } from "../spotify";
import { getCredits } from "../applicationEndpoints/getCredits";
import { getMetadata } from "../applicationEndpoints/getMetadata";
import { SpotifyCdnFile } from "../types/SpotifyCdnFile";
import CdnEndpoints, { DownloadOptions } from "./CdnEndpoints";
import TracksEndpoints from "./TracksEndpoints";
import { Readable } from "stream";
import { SpotifyLyrics } from "../types/SpotifyLyrics";

import { PathfinderClient } from "../types/Pathfinder/PathfinderClient";
import UsersEndpoints from "./UsersEndpoints";


export type TrackDownloadOptions = DownloadOptions & {
    preferredFormat?: typeof SpotifyFormats[number],
    formatUnavailable?: "fallback" | "throw"
}

function searchForFallback(preferred: typeof SpotifyFormats[number], available: typeof SpotifyFormats[number][]) {
    if (preferred.startsWith("MP4")){
        let fallback = available.find(e=>e.startsWith("MP4"));
        if (fallback) return fallback;
        throw new Error("No MP4 available for this track");
    }
    else if (preferred.startsWith("OGG")){
        let fallback = available.find(e=>e.startsWith("OGG"));
        if (fallback) return fallback;
        throw new Error("No OGG available for this track");
    }
    else throw new Error("Unknown format");
}

type ApiWithUsersMeAndCdn = unknown & unknown & {
        makeRequest: typeof SpotifyApi.prototype.makeRequest,
        ensureAuth: typeof SpotifyApi.prototype.ensureAuth,
        ensureClientToken: typeof SpotifyApi.prototype.ensureClientToken,
        me: typeof SpotifyApi.prototype.me,
        cdn: {
            fetch: typeof CdnEndpoints.prototype.fetch
        },
        users: {
            profile: typeof UsersEndpoints.prototype.profile
        }

} & PathfinderClient

export class TrackEndpointsExtended extends TracksEndpoints {

    isThereAUnplayplay: boolean;

    protected override api: ApiWithUsersMeAndCdn = undefined;

    constructor(api: ApiWithUsersMeAndCdn, isThereAUnplayplay: boolean) {
        super(api);
        this.api = api;
        this.isThereAUnplayplay = isThereAUnplayplay;
    }

    public async credits(trackId: string) {
        return getCredits(this, trackId);
    }

    public async metadata(trackId: string) {
        return getMetadata(this, "track", trackId);
    }

    public async lyrics(trackId: string, picture?: string){
        if (!picture) picture = await this.get(trackId).then(e=>e.album.images[0].url);

        return this.api.makeRequest<SpotifyLyrics>(
            "GET", 
            `https://spclient.wg.spotify.com/color-lyrics/v2/track/${trackId}/image/${encodeURIComponent(picture)}?format=json&vocalRemoval=false&market=from_token`,
            undefined, undefined, true
        );
    }

    public async inspiredByMix(trackId: string) {
        return this.api.makeRequest<{total: number, mediaItems: {uri: `spotify:playlist:${string}`}[]}>(
            "GET", 
            `https://spclient.wg.spotify.com/inspiredby-mix/v2/seed_to_playlist/spotify:track:${trackId}?response-format=json`,
            undefined, undefined, true
        );
    }

    public async fetch(trackId: string, targetPath?: string, options?: TrackDownloadOptions): Promise<void>;
    public async fetch(trackId: string, options?: TrackDownloadOptions): Promise<Readable>;
    public async fetch(trackId: string, targetPathOrOptions?: string | TrackDownloadOptions, ouch?: TrackDownloadOptions){
        let metadata = await this.metadata(trackId);

        if (!this.api.me) this.api.me = await this.api.users.profile();

        if (this.api.me?.product != "premium"){
            metadata.file = metadata.file.filter(e=>
                !e.format.startsWith("MP4") || e.format == "MP4_128"
            );
        }

        let o: TrackDownloadOptions = undefined;

        let targetPath: string = undefined;
        if (typeof targetPathOrOptions === "string") targetPath = targetPathOrOptions;
        if (typeof targetPathOrOptions === "object") o = targetPathOrOptions;
        if (ouch) o = ouch;

        let file: SpotifyCdnFile = undefined;
        if (o?.preferredFormat){
            file = metadata.file.find(e=>e.format == o.preferredFormat);
            if (!file && o.formatUnavailable == "throw") throw new Error(`${o.preferredFormat} is not available for this track`);
            if (!file && o.formatUnavailable == "fallback") file = metadata.file.find(e=>e.format == searchForFallback(o.preferredFormat, metadata.file.map(e=>e.format)));
        }
        else{
            // TODO: unplayplay token is banned now
            // i kinda figured out how to grab a token but idk what is play intent
            if (this.isThereAUnplayplay && false) file = metadata.file.find(e=>e.format.startsWith("OGG"));
            else file = metadata.file.find(e=>e.format.startsWith("MP4"));
        }

        if (!file) throw new Error("No available formats for this track");

        if (targetPath) return this.api.cdn.fetch(file, trackId, targetPath, o);
        else return this.api.cdn.fetch(file, trackId, o);
        
    }

}