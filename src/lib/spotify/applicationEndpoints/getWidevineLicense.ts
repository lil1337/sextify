import type { AuthenticatedRequestInit } from "../types/AuthenticatedRequestInit";
import { maybeThrow, orThrow } from "../stuff/maybeThrow";
import { fetchRetry } from "../stuff/fetchRetry";

export const getWidevineLicense = (i: AuthenticatedRequestInit, mediaType: string, challenge: Uint8Array) => {
    return fetchRetry(`https://gue1-spclient.spotify.com/widevine-license/v1/${mediaType}/license`, 
        {...i, method: "post", body: challenge}
    )
    .then(maybeThrow)
    .then(r=>r.blob()).then(r=>r.arrayBuffer()).then(r=>Buffer.from(r))
}