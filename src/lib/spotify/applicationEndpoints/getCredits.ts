import type { SpotifyCredits } from "../types/SpotifyCredits";
import EndpointsBase from "../endpoints/EndpointsBase";


export const getCredits = (f: EndpointsBase, trackId: string) =>
    f.getRequest<SpotifyCredits>(`https://spclient.wg.spotify.com/track-credits-view/v0/experimental/${trackId}/credits`)
