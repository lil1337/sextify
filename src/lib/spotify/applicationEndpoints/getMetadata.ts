import { mediaIdToGid } from "../stuff/mediaIdToGid";
import type { AuthenticatedRequestInit } from "../types/AuthenticatedRequestInit";
import type { TrackMetadata } from "../types/TrackMetadata";

import { maybeThrow, orThrow } from "../stuff/maybeThrow";

export const getMetadata = (i: AuthenticatedRequestInit, type: "track", itemId: string) =>{
    if (itemId.length != 16) itemId = mediaIdToGid(itemId);
    
    return fetch(`https://spclient.wg.spotify.com/metadata/4/${type}/${itemId}?market=from_token`, i)
    .then(maybeThrow)
    .then(r=>r.json())
    .then(orThrow)
    .then(r=>r as TrackMetadata)
}