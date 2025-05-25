import type { SpotifyFormats } from "../spotify";

export type SpotifyCdnFile = {
    file_id: string;
    format: typeof SpotifyFormats[number];
}

export type SpotifyFormat = typeof SpotifyFormats[number];