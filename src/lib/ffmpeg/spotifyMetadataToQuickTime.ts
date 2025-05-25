import { SpotifyCredits } from "lib/spotify/types/SpotifyCredits";
import { SpotifyTrack } from "lib/spotify/types/Spotify";

export function spotifyMetadataToQuickTime(info: SpotifyTrack, credits: SpotifyCredits, tmpFilePath?: string) {
    return {
        title: info.name,
        album: info.album.name,
        artist: info.artists.map(e => e.name),
        albumArtist: info.album.artists.map(e => e.name),
        authorUrl: `https://song.link/s/${info.id}`,
        composer: credits?.roleCredits.map(e => e.artists).flat().filter(e => e.subroles.includes("composer")).map(e => e.name),
        producer: credits?.roleCredits.map(e => e.artists).flat().filter(e => e.subroles.includes("producer")).map(e => e.name),
        copyright: credits.sourceNames.join(", "),
        date: info.album.release_date,
        disc: info.disc_number,
        publisher: credits.sourceNames.join(", "),
        year: Number(info.album.release_date.split("-")[0]),
        trackNumber: info.track_number
    }
}