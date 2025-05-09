import { SpotifyApiError, SpotifyError } from "lib/errors";

export function maybeThrow(r: Response) {
    if (r.headers.get("content-length") === "0" && r.status.toString()[0] !== "2")
        throw new SpotifyApiError(r.status, r.statusText, r.url);
    return r;
}

export function orThrow(json: any){
    if (json.error) throw new SpotifyError(json.error.message);
    return json;
}