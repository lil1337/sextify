import { Credits } from "lib/spotify/types/Credits";
import { Track } from "lib/spotify/types/Spotify";

export function spotifyMetadataToQuickTime(info: Track, credits: Credits, tmpFilePath?: string) {
    return {
        title: info.name,
        album: info.album.name,
        artist: info.artists.map(e => e.name),
        albumArtist: info.album.artists.map(e => e.name),
        authorUrl: info.external_urls.spotify,
        composer: credits.roleCredits.map(e => e.artists).flat().filter(e => e.subroles.includes("composer")).map(e => e.name),
        producer: credits.roleCredits.map(e => e.artists).flat().filter(e => e.subroles.includes("producer")).map(e => e.name),
        copyright: credits.sourceNames.join(", "),
        date: info.album.release_date,
        disc: info.disc_number,
        publisher: credits.sourceNames.join(", "),
        year: Number(info.album.release_date.split("-")[0]),
        trackNumber: info.track_number,
        coverPath: tmpFilePath
    }
}