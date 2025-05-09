import { SpotifyError } from "./SpotifyError";

export class SpotifyResolveError extends SpotifyError { 
    constructor(
        obj: string,
        reason: string
    ) {
        super(`Could not resolve ${obj}: ${reason}`);
        this.message = `Could not resolve ${obj}: ${reason}`;
    }
}