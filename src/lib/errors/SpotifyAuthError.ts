import { SpotifyError } from "./SpotifyError";

export class SpotifyAuthError extends SpotifyError { 
    constructor(
        message: string
    ) {
        super(message);
        this.message = `Spotify Auth failed: ${message}`;
    }
}