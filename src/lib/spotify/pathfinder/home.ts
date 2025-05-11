import { SpotifyPathfinderSearchQuery } from "../../../../out";
import { SpotifySearchResponseDesktopSearch } from "../types/DesktopSearch";
import { Home } from "../types/Home";
import { PathfinderClient } from "../types/PathfinderClient";
import { PathfinderHomeVariables } from "../types/PathfinderHomeVariables";

export const home = (f: PathfinderClient, variables: PathfinderHomeVariables) => {
    if (typeof variables.facet !== "string") variables.facet = "";
    if (!variables.timeZone) variables.timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (!variables.sp_t) throw new Error("sp_t cookie is required to fetch home");

    return f.makePathfinderQuery<Home>({
        operationName: "home", 
        variables: variables,
        extensions: {persistedQuery: {version: 1, sha256Hash: "c11ff5d8f508cb1a3dad3f15ee80611cda7df7e6fb45212e466fb3e84a680bf9"}}
    })
}