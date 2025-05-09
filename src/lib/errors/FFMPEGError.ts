export class FFMPEGError extends Error { 
    constructor(
        message: string
    ) {
        super();
        this.message = `FFMPEG Error: ${message}`;
    }
}