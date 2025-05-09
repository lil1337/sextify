export class SpotifyError extends Error { 
    constructor(
        message: string
    ) {
        super();
        this.message = `Spotify Error: ${message}`;
    }
}