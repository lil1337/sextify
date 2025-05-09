
export type StorageResolveResponse = {
    cdnurl: string[];
    result: "CDN" | "STORAGE" | "RESTRICTED" | "UNRECOGNIZED";
    fileid: string;
}