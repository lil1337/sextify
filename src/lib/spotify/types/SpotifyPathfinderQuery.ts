export type SpotifyPathfinderSearchQuery = {
    includeArtistHasConcertsField?: boolean,
    includeAudiobooks?: boolean,
    includeAuthors?: boolean,
    includeLocalConcertsField?: boolean,
    includePreReleases?: boolean,
    limit?: number,
    numberOfTopResults?: number,
    offset?: number,
    searchTerm: string
}