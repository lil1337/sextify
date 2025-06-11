import { dumbahhSpotifyTotp } from "../stuff/dumbahhSpotifyTotp";
import { fetchRetry } from "../stuff/fetchRetry";
import { maybeThrow, orThrow } from "../stuff/maybeThrow";
import { SpotifyAccessToken } from "../types/SpotifyAccessToken";

export async function getAccessToken(i: RequestInit) {
    let { serverTime } = {
        serverTime: Math.floor(Date.now() / 1000)
    }

    const totpResult = dumbahhSpotifyTotp(1e3 * serverTime).toString()


    return await fetchRetry("https://open.spotify.com/api/token?"+ new URLSearchParams(Object.entries({
        reason: "init",
        productType: "web-player",
        totp: totpResult,
        totpServer: totpResult,
        totpVer: "5",
        sTime: serverTime.toString(),
        cTime: (serverTime * 1000).toString(),
        buildVer: "web-player_2025-06-11_1749656582461_57f7d10",
        buildDate: "2025-06-11"
    })), i)
    .then(maybeThrow)
    .then(r=>r.json())
    .then(orThrow)
    .then(r=>r as SpotifyAccessToken);
}