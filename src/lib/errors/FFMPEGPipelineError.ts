export class FFMPEGPipelineError extends Error { 
    constructor(
        message: string
    ) {
        super(`FFMPEG Pipeline Error: ${message}`);
        this.message = `FFMPEG Pipeline Error: ${message}`;
    }
}