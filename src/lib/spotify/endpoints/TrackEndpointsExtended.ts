
import type { SpotifyApi, SpotifyFormats } from "../spotify";
import { getCredits } from "../applicationEndpoints/getCredits";
import { getMetadata } from "../applicationEndpoints/getMetadata";
import { CdnFile } from "../types/CdnFile";
import { DownloadOptions } from "./CdnEndpoints";
import TracksEndpoints from "./TracksEndpoints";
import { Readable } from "stream";


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

export class TrackEndpointsExtended extends TracksEndpoints {

    isThereAUnplayplay: boolean;

    constructor(api: SpotifyApi, isThereAUnplayplay: boolean) {
        super(api);
        this.isThereAUnplayplay = isThereAUnplayplay;
    }

    public async credits(trackId: string) {
        return getCredits(await this.api.ensureAuth(), trackId);
    }

    public async metadata(trackId: string) {
        this.api.ensureAuth();
        return getMetadata(await this.api.ensureAuth(), "track", trackId);
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

        let file: CdnFile = undefined;
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