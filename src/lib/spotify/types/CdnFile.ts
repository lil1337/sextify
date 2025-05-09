import type { SpotifyFormats } from "../spotify";

export type CdnFile = {
    file_id: string;
    format: typeof SpotifyFormats[number];
}

export type SpotifyFormat = typeof SpotifyFormats[number];