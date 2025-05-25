export type ImageSourceDesktopSearch = {
    height: number | null;
    url: string;
    width: number | null;
};

export type ColorDesktopSearch = {
    hex: string;
    isFallback: boolean;
};

export type ExtractedColorsDesktopSearch = {
    colorDark: ColorDesktopSearch;
};

// Albums
export type AlbumArtistDesktopSearch = {
    profile: { name: string };
    uri: string;
};

export type AlbumDesktopSearch = {
    __typename: "SpotifyAlbum";
    name: string;
    type: string;
    uri: string;
    date: { year: number };
    playability: { playable: boolean; reason: string };
    artists: { items: AlbumArtistDesktopSearch[] };
    coverArt: { extractedColors: ExtractedColorsDesktopSearch; sources: ImageSourceDesktopSearch[] };
};

export type AlbumResponseWrapperDesktopSearch = {
    __typename: "AlbumResponseWrapper";
    data: AlbumDesktopSearch;
};

// Artists
export type ArtistDesktopSearch = {
    __typename: "SpotifyArtist";
    profile: { name: string; verified: boolean };
    uri: string;
    visuals: {
        avatarImage: {
            extractedColors: ExtractedColorsDesktopSearch;
            sources: ImageSourceDesktopSearch[];
        };
    };
};

export type ArtistResponseWrapperDesktopSearch = {
    __typename: "ArtistResponseWrapper";
    data: ArtistDesktopSearch;
};

// Audiobooks
export type AudiobookResponseWrapperDesktopSearch = {
    __typename: "AudiobookResponseWrapper";
    data: unknown;
};

// Chip Order
export type ChipOrderItemDesktopSearch = {
    typeName: string;
};

export type ChipOrderDesktopSearch = {
    items: ChipOrderItemDesktopSearch[];
};

// Episodes
export type EpisodeDesktopSearch = {
    __typename: "Episode";
    contentRating: {
        label: string;
    };
    coverArt: {
        extractedColors: ExtractedColorsDesktopSearch;
        sources: ImageSourceDesktopSearch[];
    };
    description: string;
    duration: {
        totalMilliseconds: number;
    };
    gatedEntityRelations: unknown[];
    mediaTypes: string[];
    name: string;
    playability: {
        reason: string;
    };
    playedState: {
        playPositionMilliseconds: number;
        state: "NOT_STARTED" | "IN_PROGRESS" | "FINISHED";
    };
    podcastV2: PodcastResponseWrapperDesktopSearch;
    releaseDate: {
        isoString: string;
        precision: string;
    };
    restrictions: {
        paywallContent: boolean;
    };
    uri: string;
};

export type EpisodeResponseWrapperDesktopSearch = {
    __typename: "EpisodeResponseWrapper";
    data: EpisodeDesktopSearch;
};

// Genres
export type GenreResponseWrapperDesktopSearch = {
    __typename: "GenreResponseWrapper";
    data: unknown;
};

// Playlists
export type PlaylistDesktopSearch = {
    __typename: "Playlist";
    name: string;
    description: string;
    format: string;
    uri: string;
    images: {
        items: {
            extractedColors: ExtractedColorsDesktopSearch;
            sources: ImageSourceDesktopSearch[];
        }[];
    };
    attributes: unknown[];
    ownerV2: UserResponseWrapperDesktopSearch;
};

export type PlaylistResponseWrapperDesktopSearch = {
    __typename: "PlaylistResponseWrapper";
    data: PlaylistDesktopSearch;
};

// Podcasts
export type PodcastDesktopSearch = {
    __typename: "Podcast";
    name: string;
    mediaType: string;
    uri: string;
    publisher: { name: string };
    coverArt: { sources: ImageSourceDesktopSearch[] };
};

export type PodcastResponseWrapperDesktopSearch = {
    __typename: "PodcastResponseWrapper";
    data: PodcastDesktopSearch;
};

// Top Results
export type TopResultItemDesktopSearch =
    | { item: ArtistResponseWrapperDesktopSearch; matchedFields: string[] }
    | { item: TrackResponseWrapperDesktopSearch; matchedFields: string[] }
    | { item: PlaylistResponseWrapperDesktopSearch; matchedFields: string[] };

export type TopResultsDesktopSearch = {
    itemsV2: TopResultItemDesktopSearch[];
};

// Tracks
export type TrackArtistDesktopSearch = {
    profile: { name: string };
    uri: string;
};

export type TrackDesktopSearch = {
    __typename: "SpotifyTrack";
    id: string;
    name: string;
    uri: string;
    trackMediaType: string;
    contentRating: { label: string };
    duration: { totalMilliseconds: number };
    playability: { playable: boolean; reason: string };
    albumOfTrack: {
        id: string;
        name: string;
        uri: string;
        coverArt: {
            extractedColors: ExtractedColorsDesktopSearch;
            sources: ImageSourceDesktopSearch[];
        };
    };
    artists: { items: TrackArtistDesktopSearch[] };
};

export type TrackResponseWrapperDesktopSearch = {
    __typename: "TrackResponseWrapper";
    data: TrackDesktopSearch;
};

// Users
export type UserDesktopSearch = {
    __typename: "User";
    username: string;
    uri: string;
    avatar?: { sources: ImageSourceDesktopSearch[] };
};

export type UserResponseWrapperDesktopSearch = {
    __typename: "UserResponseWrapper";
    data: UserDesktopSearch;
};

export type SpotifySearchResponseDesktopSearch = {
    searchV2: {
        albumsV2: {
            __typename: string;
            items: AlbumResponseWrapperDesktopSearch[];
            totalCount: number;
        };
        artists: {
            __typename: string;
            items: ArtistResponseWrapperDesktopSearch[];
            totalCount: number;
        };
        audiobooks: {
            __typename: string;
            items: AudiobookResponseWrapperDesktopSearch[];
            totalCount: number;
        };
        chipOrder: ChipOrderDesktopSearch;
        episodes: {
            __typename: string;
            items: EpisodeResponseWrapperDesktopSearch[];
            totalCount: number;
        };
        genres?: {
            __typename: string;
            items: GenreResponseWrapperDesktopSearch[];
            totalCount: number;
        };
        playlists?: {
            __typename: string;
            items: PlaylistResponseWrapperDesktopSearch[];
            totalCount: number;
        };
        podcasts?: {
            __typename: string;
            items: PodcastResponseWrapperDesktopSearch[];
            totalCount: number;
        };
        topResultsV2?: TopResultsDesktopSearch;
        tracksV2?: {
            __typename: string;
            items: TrackResponseWrapperDesktopSearch[];
            totalCount: number;
        };
        users?: {
            __typename: string;
            items: UserResponseWrapperDesktopSearch[];
            totalCount: number;
        };
    };
};