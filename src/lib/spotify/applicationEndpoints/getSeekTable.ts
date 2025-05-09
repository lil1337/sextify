import { SeekTable } from "../types/SeekTable";
import { maybeThrow, orThrow } from "../stuff/maybeThrow";
export const getSeekTable = (fileId: string) => 
    fetch(`https://seektables.scdn.co/seektable/${fileId}.json`, {headers: {
        "Accept": "*/*",
        "Accept-Encoding": "gzip, deflate, br, zstd",
        "Accept-Language": "en-US",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
        "Origin": "https://open.spotify.com/",
        "Pragma": "no-cache",
        "Priority": "u=4",
        "Referer": "https://open.spotify.com/",
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "cross-site"
    }})
    .then(maybeThrow)
    .then(r=>r.json())
    .then(orThrow)
    .then(r=>r as SeekTable);