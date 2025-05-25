export interface PathfinderTrack {
    albumOfTrack: {
        coverArt: {
            sources: {
                url: string
            }[]
        },
        uri: string
    },

    artists: {
        items: {
            profile: { name: string },
            uri: string,
        }[]
    },

    discNumber: number,
    duration: { totalMilliseconds: number },
    playability: {
        playable: boolean,
        reason: string
    },

    contentRating: {
        label: "NONE" | "EXPLICIT"
    },


    id: string,
    name: string,
    playcount: number,
    uri: string,
    __typename?: "Track"
}