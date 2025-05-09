import { spawn } from "child_process";
import { Readable } from "stream";
import { ID3Metadata } from "./types/ID3Metadata";
import { QuickTimeMetadata } from "./types/QuickTimeMetadata";
import { ffmpegId3CoverArgs, ffmpegId3MetadataArgs } from "./ffmpegId3MetadataArgs";
import { ffmpegQuickTimeCoverArgs, ffmpegQuickTimeMetadataArgs } from "./ffmpegQuickTimeMetadataArgs";
import { pipeline } from "stream/promises";
import { FFMPEGError } from "lib/errors/FFMPEGError";
import { FFMPEGPipelineError } from "lib/errors/FFMPEGPipelineError";
import { unlink } from "fs/promises";


export type FfmpegStreamOptions = {
    decryptionKey: Buffer, format?: string, args?: string[],
    overrideArgs?: string[],
    metadata?: Partial<ID3Metadata & QuickTimeMetadata & {coverPath?: string}>,
    verbose?: boolean, ffmpegPath?: string,
    modifyArgs: (args: string[]) => string[],
    removeTmpAlbumArt?: boolean,
    as: "file" | "stream"
}


export function ffmpegStream(source: Readable, target: FfmpegStreamOptions & {as: "stream"}): Readable
export function ffmpegStream(source: Readable, target: string, ouch: FfmpegStreamOptions & {as: "file"}): Promise<void>
export function ffmpegStream(source: Readable, target: string | FfmpegStreamOptions, ouch?: FfmpegStreamOptions): Promise<void> | Readable{

    let o = (typeof target === "string") ? ouch : target;

    // ffmpeg is stupid - exits with "ipod is not seekable"
    if (o.as == "stream" && o.format == "ipod") throw new FFMPEGError("ipod format is not streamable");

    // ffmpeg is stupid - outputs invalid unplayable file
    if (o.as == "stream" && o.format == "mp3" && o.metadata?.coverPath) o.metadata.coverPath = undefined;

    let args = [
        ... o.decryptionKey ? ["-decryption_key", o.decryptionKey.toString("hex")] : [],
        
        "-i", "-", 
        ... o.metadata?.coverPath ? ["-i", o.metadata.coverPath] : [],

        "-map", "0:0", ... o.metadata?.coverPath ? ["-map", "1:0"] : [],


        ... o.metadata?.coverPath && o.format === "ipod" ? ["-c:v", "copy"] : [],
        ... o.metadata?.coverPath && o.format === "mp3" ? ffmpegId3CoverArgs(o.metadata.coverPath) : [],
        ... o.metadata?.coverPath && o.format === "ipod" ? ffmpegQuickTimeCoverArgs(o.metadata.coverPath) : [],

        ... o.args || [],
        

        ... o.metadata && o.format === "mp3" ? ffmpegId3MetadataArgs(o.metadata) : [],
        ... o.metadata && o.format !== "mp3" ? ffmpegQuickTimeMetadataArgs(o.metadata) : [],
       
        ... o.format ? ["-f", o.format] : [],
      
        ((o.as == "file" && typeof target === "string") ? target : "-")
    ];


    if (o.overrideArgs) args = o.overrideArgs;
    if (o.modifyArgs) args = o.modifyArgs(args);

    if (o.verbose) console.log("\nffmpeg\n", 
        args.map((c, i) => (i < args.length - 1 ? ["       "+c.padEnd(15), args[i + 1]] : null))
        .filter(Boolean).filter((e, idx) => idx % 2 == 0)
        .map(e=>e.join(" ")).join(" \\ \n")
    ,"\n");

    let s = spawn(o.ffmpegPath ?? "ffmpeg", args, {stdio: ["pipe", "pipe", "pipe"]});


    let stderr: string = "";
    s.stderr.on("data", e=>{
        stderr += e;
        if (o.verbose) console.log(e.toString());
    });

    let pipe = pipeline(source, s.stdin).catch(err => {
        if (!o.verbose) process.stderr.write(stderr);
        s.stdin.destroy(err);

        throw new FFMPEGPipelineError(err.message);
    });




    if (o.as == "file") return new Promise(resolve => s.on("exit", () => {
        if (o.removeTmpAlbumArt && o.metadata?.coverPath) unlink(o.metadata.coverPath).catch(e=>console.log(e));
        resolve();
    }));
    else {
        s.on("exit", () => {
            if (o.removeTmpAlbumArt && o.metadata?.coverPath) unlink(o.metadata.coverPath).catch(e=>console.log(e));
        });
        return s.stdout;
    }
    
}