import { PathfinderTrack } from "./PathfinderTrack"

export interface PathfinderInternalLinkRecommenderResponse {
    seoRecommendedTrack: {
        items: {data: PathfinderTrack}[]
    }
}