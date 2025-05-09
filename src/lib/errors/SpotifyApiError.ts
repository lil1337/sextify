import { SpotifyError } from "./SpotifyError";

export class SpotifyApiError extends SpotifyError { 
    constructor(
        statusCode: number,
        message: string,
        url?: string
    ) {
        super(message);
        this.message = `${url ? url.replaceAll("https://", "") : "Request"} failed with code ${statusCode || "unknown"} (${message})`;
    }
}