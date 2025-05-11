import { home } from '../pathfinder/home';
import { searchDesktop } from '../pathfinder/searchDesktop';
import { PathfinderHomeVariables } from '../types/PathfinderHomeVariables';
import { SpotifyPathfinderSearchQuery } from '../types/SpotifyPathfinderQuery';
import EndpointsBase from './EndpointsBase';

export default class PathfinderEndpoints extends EndpointsBase {

    public searchDesktop(variables: SpotifyPathfinderSearchQuery) {
        return searchDesktop(this.api, variables);
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
