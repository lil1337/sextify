import { mediaIdToGid } from "../stuff/mediaIdToGid";
import type { TrackMetadata } from "../types/TrackMetadata";

import EndpointsBase from "../endpoints/EndpointsBase";


export const getMetadata = (f: EndpointsBase, type: "track" | "album" | "artist" | "playlist" | "show" | "episode" | "user" | "podcast", itemId: string) => {
    if (itemId.length != 16) itemId = mediaIdToGid(itemId);

    return f.getRequest<TrackMetadata>(`https://spclient.wg.spotify.com/metadata/4/${type}/${itemId}?market=from_token`)
}