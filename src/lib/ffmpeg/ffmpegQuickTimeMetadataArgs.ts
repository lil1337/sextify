import type { QuickTimeMetadata } from "./types/QuickTimeMetadata";

export function ffmpegQuickTimeMetadataArgs(metadata: QuickTimeMetadata & {coverPath?: string}){
    let args = [];
    if (metadata.title) args.push("-metadata", `title=${metadata.title}`);
    if (metadata.artist) args.push("-metadata", `artist=${metadata.artist.join(", ")}`);
    if (metadata.albumArtist) args.push("-metadata", `album_artist=${metadata.albumArtist.join(", ")}`);
    if (metadata.album) args.push("-metadata", `album=${metadata.album}`);
    if (metadata.grouping) args.push("-metadata", `grouping=${metadata.grouping}`);
    if (metadata.composer) args.push("-metadata", `composer=${metadata.composer.join(", ")}`);
    if (metadata.year) args.push("-metadata", `year=${metadata.year}`);
    if (metadata.trackNumber) args.push("-metadata", `track=${metadata.trackNumber}`);
    if (metadata.comments) args.push("-metadata", `comment=${metadata.comments}`);
    if (metadata.genre) args.push("-metadata", `genre=${metadata.genre}`);
    if (metadata.copyright) args.push("-metadata", `copyright=${metadata.copyright}`);
    if (metadata.description) args.push("-metadata", `description=${metadata.description}`);
    if (metadata.synopsis) args.push("-metadata", `synopsis=${metadata.synopsis}`);
    if (metadata.show) args.push("-metadata", `show=${metadata.show}`);
    if (metadata.episodeID) args.push("-metadata", `episode_id=${metadata.episodeID}`);
    if (metadata.network) args.push("-metadata", `network=${metadata.network}`);


    return args;
}

export function ffmpegQuickTimeCoverArgs(coverPath: string){
    return [
        "-disposition:1", "attached_pic"
    ]
}