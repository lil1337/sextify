import { ID3Metadata } from "./types/ID3Metadata";

export function ffmpegId3MetadataArgs(metadata: ID3Metadata & { coverPath?: string }) {
    let args = ["-id3v2_version", "3"];
    if (metadata.title) args.push("-metadata", `title=${metadata.title}`);
    if (metadata.subtitle) args.push("-metadata", `TIT3=${metadata.subtitle}`);
    if (metadata.comment) args.push("-metadata", `comment=${metadata.comment}`);
    if (metadata.description) args.push("-metadata", `description=${metadata.description}`);
    if (metadata.artist) args.push("-metadata", `artist=${metadata.artist.join(", ")}`);
    if (metadata.albumArtist) args.push("-metadata", `album_artist=${metadata.albumArtist.join(", ")}`);
    if (metadata.album) args.push("-metadata", `album=${metadata.album}`);
    if (metadata.date) args.push("-metadata", `date=${metadata.date}`);
    if (metadata.trackNumber) args.push("-metadata", `track=${metadata.trackNumber}`);
    if (metadata.TRACKTOTAL) args.push("-metadata", `TRACKTOTAL=${metadata.TRACKTOTAL}`);
    if (metadata.disc) args.push("-metadata", `disc=${metadata.disc}`);
    if (metadata.genre) args.push("-metadata", `genre=${metadata.genre}`);
    if (metadata.grouping) args.push("-metadata", `grouping=${metadata.grouping}`);
    if (metadata.composer) args.push("-metadata", `composer=${metadata.composer.join(", ")}`);
    if (metadata.producer) args.push("-metadata", `producer=${metadata.producer.join(", ")}`);
    if (metadata.publisher) args.push("-metadata", `publisher=${metadata.publisher}`);
    if (metadata.copyright) args.push("-metadata", `copyright=${metadata.copyright}`);
    if (metadata.authorUrl) args.push("-metadata", `author_url=${metadata.authorUrl}`);
    if (metadata.encoder) args.push("-metadata", `encoder=${metadata.encoder}`);

    return args;
}

export function ffmpegId3CoverArgs(coverPath: string) {
    return [
        "-metadata:s:v", "title=\"Album cover\"",
        "-metadata:s:v", "comment=\"Cover (front)\"",
        "-disposition:1", "attached_pic"
    ]
}