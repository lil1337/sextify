import { dumbahhSpotifyTotp } from "../stuff/dumbahhSpotifyTotp";
import { fetchRetry } from "../stuff/fetchRetry";
import { maybeThrow, orThrow } from "../stuff/maybeThrow";
import { SpotifyAccessToken } from "../types/SpotifyAccessToken";
import { getServerTime } from "./serverTime";

export async function getAccessToken(i: RequestInit) {
    let { serverTime } = await getServerTime(i);


    return await fetchRetry("https://open.spotify.com/get_access_token?"+ new URLSearchParams(Object.entries({
        reason: "init",
        productType: "web-player",
        totp: dumbahhSpotifyTotp(1e3 * serverTime).toString(),
        totpVer: "5",
        ts: serverTime.toString(),
    })), i)
    .then(maybeThrow)
    .then(r=>r.json())
    .then(orThrow)
    .then(r=>r as SpotifyAccessToken);
}