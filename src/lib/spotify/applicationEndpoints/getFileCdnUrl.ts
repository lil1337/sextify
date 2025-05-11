import EndpointsBase from "../endpoints/EndpointsBase";
import type { StorageResolveResponse } from "../types/StorageResolveResponse";

export const getFileCdnUrl = (f: EndpointsBase, fileId: string) =>
    f.getRequest<StorageResolveResponse>(`https://gue1-spclient.spotify.com/storage-resolve/v2/files/audio/interactive/11/${fileId}?version=10000000&product=9&platform=39&alt=json`)