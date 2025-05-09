import { SpotifyError } from "./SpotifyError";

export class SpotifyStreamError extends SpotifyError { 
    constructor(
        reason: string
    ) {
        super(reason);
        this.message = reason;
    }
}