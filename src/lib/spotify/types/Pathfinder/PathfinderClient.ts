import { PathfinderQuery } from "./PathfinderQuery"
import { PathfinderResponse } from "./PathfinderResponse"

export interface PathfinderClient {
    makePathfinderQuery<TReturnType>(query: PathfinderQuery): Promise<PathfinderResponse<TReturnType>>
}