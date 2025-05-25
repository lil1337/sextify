import { SpotifyPathfinderSearchQuery } from "../../../../out";
import { SpotifySearchResponseDesktopSearch } from "../types/DesktopSearch";
import { PathfinderClient } from "../types/Pathfinder/PathfinderClient";

export function searchDesktop(f: PathfinderClient, variables: SpotifyPathfinderSearchQuery) {
    if (typeof variables.includeArtistHasConcertsField === "undefined") variables.includeArtistHasConcertsField = false;
    if (typeof variables.includeAudiobooks === "undefined") variables.includeAudiobooks = true;
    if (typeof variables.includeAuthors === "undefined") variables.includeAuthors = false;
    if (typeof variables.includeLocalConcertsField === "undefined") variables.includeLocalConcertsField = false;
    if (typeof variables.includePreReleases === "undefined") variables.includePreReleases = true;
    if (typeof variables.limit === "undefined") variables.limit = 10;
    if (typeof variables.numberOfTopResults === "undefined") variables.numberOfTopResults = 5;    
    if (typeof variables.offset === "undefined") variables.offset = 0;



    return f.makePathfinderQuery<SpotifySearchResponseDesktopSearch>({
        operationName: "searchDesktop", 
        variables: variables,
        extensions: {persistedQuery: {version: 1, sha256Hash: "d9f785900f0710b31c07818d617f4f7600c1e21217e80f5b043d1e78d74e6026"}}
    })
}