import type { AuthenticatedRequestInit } from "../types/AuthenticatedRequestInit";
import type { StorageResolveResponse } from "../types/StorageResolveResponse";
import { maybeThrow, orThrow } from "../stuff/maybeThrow";

export const getFileCdnUrl = (i: AuthenticatedRequestInit, fileId: string) =>
    fetch(`https://gue1-spclient.spotify.com/storage-resolve/v2/files/audio/interactive/11/${fileId}?version=10000000&product=9&platform=39&alt=json`, i)
    .then(maybeThrow)
    .then(r=>r.json())
    .then(orThrow)
    .then(r=>r as StorageResolveResponse);