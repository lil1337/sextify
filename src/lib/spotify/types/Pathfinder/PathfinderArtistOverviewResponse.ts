import { PathfinderTrack } from "./PathfinderTrack"

export interface SpotifyArtistOverviewHeaderImage {
    data: {
        __typename: "ImageV2",
        sources: {
            maxHeight: number, maxWidth: number,
            url: string
        }[]
    }
}

export interface SpotifyArtistOverviewVisuals {
    avatarImage: {
        extractedColors: { colorRaw: { hex: string } },
        sources: { width: number, height: number, url: string }[]
    },
    gallery: {
        items: {
            sources: { width: number, height: number, url: string }[]
        }[]
    }
}

export interface SpotifyArtistOverviewProfile {
    biography: {
        text: string,
        type: "AUTOBIOGRAPHY"
    },
    externalLinks: {
        items: {
            name: string,
            url: string
        }[]
    },
    name: string,
    verified?: boolean
}

export interface SpotifyArtistOverviewDiscographyPopularRelease {
    totalCount: number,
    items: {
        copyright: {
            items: { text: string, type: string }[]
        },
        coverArt: {
            sources: {
                width: number, height: number, url: string
            }[]
        },
        date: {
            day: number, month: number, year: number,
            precision: "MONTH" | "DAY" | "YEAR"
        },
        playability: {
            playable: boolean,
            reason: string
        },
        sharingInfo: {
            shareId: string,
            shareUrl: string
        },
        tracks: {
            totalCount: number
        },
        type: "ALBUM" | "SINGLE",
        uri: string,
        id: string,
        label: string,
        name: string
    }
}



export interface SpotifyArtistOverviewRelatedArtist {
    profile: {name: string},
    visuals: {
        avatarImage: {
            sources: {
                width: number, height: number, url: string
            }[]
        }
    },
    id: string, uri: string
}

export interface SpotifyArtistOverviewRelatedContent {
    relatedArtists: {
        totalCount: number,
        items: SpotifyArtistOverviewRelatedArtist[]
    }
}


export interface SpotifyArtistOverviewDiscography {
    popularReleasesAlbums: {
        items: SpotifyArtistOverviewDiscographyPopularRelease[]
    },
    topTracks: {
        items: {
            track: PathfinderTrack,
            uid: string
        }[]
    }
}


export interface SpotifyArtistOverviewUnion {
    id: string,
    headerImage: SpotifyArtistOverviewHeaderImage,
    profile: SpotifyArtistOverviewProfile,
    visuals: SpotifyArtistOverviewVisuals,
    discography: SpotifyArtistOverviewDiscography,
    relatedContent: SpotifyArtistOverviewRelatedContent
    __typename: "Artist"
}


export interface SpotifyArtistOverview {
    artistUnion: SpotifyArtistOverviewUnion
}