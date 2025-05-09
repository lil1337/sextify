import type { AuthenticatedRequestInit } from "../types/AuthenticatedRequestInit";
import type { Credits } from "../types/Credits";
import { maybeThrow, orThrow } from "../stuff/maybeThrow";


export const getCredits = (i: AuthenticatedRequestInit, trackId: string) =>
    fetch(`https://spclient.wg.spotify.com/track-credits-view/v0/experimental/${trackId}/credits`, i).then(maybeThrow)
    .then(r=>r.json()).then(orThrow) as Promise<Credits>
