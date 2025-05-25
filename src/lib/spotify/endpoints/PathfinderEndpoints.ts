import { SpotifyApi } from '..';
import { artistOverview } from '../pathfinder/artistOverview';
import { home } from '../pathfinder/home';
import { internalLinkRecommenderTrack } from '../pathfinder/internalLinkRecommenderTrack';
import { searchDesktop } from '../pathfinder/searchDesktop';
import { PathfinderClient } from '../types/Pathfinder/PathfinderClient';
import { PathfinderHomeVariables } from '../types/Pathfinder/PathfinderHomeVariables';
import { SpotifyPathfinderSearchQuery } from '../types/SpotifyPathfinderQuery';
import EndpointsBase from './EndpointsBase';

export default class PathfinderEndpoints extends EndpointsBase {


    protected override api: unknown & {
        makeRequest: typeof SpotifyApi.prototype.makeRequest,
        ensureAuth: typeof SpotifyApi.prototype.ensureAuth,
        ensureClientToken: typeof SpotifyApi.prototype.ensureClientToken,
        cookies: string
    } & PathfinderClient = undefined;

    constructor(api: unknown & {
        makeRequest: typeof SpotifyApi.prototype.makeRequest,
        ensureAuth: typeof SpotifyApi.prototype.ensureAuth,
        ensureClientToken: typeof SpotifyApi.prototype.ensureClientToken,
        cookies: string
    } & PathfinderClient) {
        super(api);
        this.api = api;
    }

    public searchDesktop(variables: SpotifyPathfinderSearchQuery) {
        return searchDesktop(this.api, variables);
    }

    public artistOverview(artistId: string) {
        return artistOverview(this.api, artistId);
    }

    public internalLinkRecommenderTrack(trackId: string, limit?: number) {
        return internalLinkRecommenderTrack(this.api, trackId, limit);
    }

    public home(variables?: Partial<PathfinderHomeVariables>) {
        if (!variables) variables = {};
        if (!variables.sp_t){
            if (!this.api.cookies) throw new Error("sp_t cookie is required to fetch home and you don't have any");
            let spt = this.api.cookies.split(";").map(e=>e.trim()).find(e=>e.startsWith("sp_t="));
            if (!spt) throw new Error("sp_t cookie is required to fetch home");
            variables.sp_t = spt.split("=")[1];
        }
        return home(this.api, variables as PathfinderHomeVariables);
    }

}
