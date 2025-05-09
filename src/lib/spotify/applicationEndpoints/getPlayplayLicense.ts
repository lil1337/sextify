import type { AuthenticatedRequestInit } from "../types/AuthenticatedRequestInit";
import { maybeThrow, orThrow } from "../stuff/maybeThrow";

export const getPlayplayLicense = (i: AuthenticatedRequestInit, fileId: string, challenge: Uint8Array) => {
    return fetch(`https://gew4-spclient.spotify.com/playplay/v1/key/${fileId}`, {
        ...i, method: "post", body: challenge, 
        headers: {
            "Accept": "*",
            "Accept-Language": "*",
            "Connection": "keep-alive",
            "Content-Type": "application/json",
            authorization: i.headers.authorization,
        }
    })
    .then(maybeThrow)
    .then(r=>r.blob()).then(r=>r.arrayBuffer()).then(r=>Buffer.from(r))
}