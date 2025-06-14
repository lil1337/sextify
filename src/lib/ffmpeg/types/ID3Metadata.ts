export type ID3Metadata = {
    title?: string,
    subtitle?: string,
    comment?: string,
    description?: string,
    artist?: string[],
    albumArtist?: string[],
    album?: string,
    date?: string,
    trackNumber?: number,
    TRACKTOTAL?: number,
    disc?: number,
    genre?: string,
    grouping?: string,
    composer?: string[],
    producer?: string[],
    publisher?: string,
    copyright?: string,
    authorUrl?: string,
    encoder?: string
}