import { SpotifySearchResponseDesktopSearch } from "../types/DesktopSearch";
import { SpotifyArtistOverview } from "../types/Pathfinder/PathfinderArtistOverviewResponse";
import { PathfinderClient } from "../types/Pathfinder/PathfinderClient";

export function artistOverview(f: PathfinderClient, artistId: string) {
    return f.makePathfinderQuery<SpotifyArtistOverview>({
        operationName: "queryArtistOverview", 
        variables: {
            locale: "", uri: `spotify:artist:${artistId}`
        },
        extensions: {persistedQuery: {version: 1, sha256Hash: "1ac33ddab5d39a3a9c27802774e6d78b9405cc188c6f75aed007df2a32737c72"}}
    })
}