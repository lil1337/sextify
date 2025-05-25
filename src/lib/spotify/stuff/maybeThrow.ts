import { SpotifyApiError, SpotifyError } from "lib/errors";

export function maybeThrow(r: Response) {
    if (r.headers.get("content-length") === "0" && r.status.toString()[0] !== "2" && r.status != 429)
        throw new SpotifyApiError(r.status, r.statusText, r.url);
    return r;
}

type Fuck = {error: {message: string}};
export function orThrow<T>(json: T): T {
    if ((json as Fuck).error && !(json as Fuck).error?.message?.length) console.log("[spotify]", json)
    if ((json as Fuck).error) throw new SpotifyError((json as Fuck).error.message);
    return json as T;
}