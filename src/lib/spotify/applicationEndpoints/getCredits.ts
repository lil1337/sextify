import type { Credits } from "../types/Credits";
import EndpointsBase from "../endpoints/EndpointsBase";


export const getCredits = (f: EndpointsBase, trackId: string) =>
    f.getRequest<Credits>(`https://spclient.wg.spotify.com/track-credits-view/v0/experimental/${trackId}/credits`)
