import { SpotifySearchResponseDesktopSearch } from "../types/DesktopSearch";
import { SpotifyArtistOverview } from "../types/Pathfinder/PathfinderArtistOverviewResponse";
import { PathfinderClient } from "../types/Pathfinder/PathfinderClient";
import { PathfinderInternalLinkRecommenderResponse } from "../types/Pathfinder/PathfinderInternalLinkRecommenderResponse";

export function internalLinkRecommenderTrack(f: PathfinderClient, trackId: string, limit: number = 5) {
    return f.makePathfinderQuery<PathfinderInternalLinkRecommenderResponse>({
        operationName: "internalLinkRecommenderTrack", 
        variables: {
            limit, uri: `spotify:track:${trackId}`
        },
        extensions: {persistedQuery: {version: 1, sha256Hash: "c77098ee9d6ee8ad3eb844938722db60570d040b49f41f5ec6e7be9160a7c86b"}}
    })
}