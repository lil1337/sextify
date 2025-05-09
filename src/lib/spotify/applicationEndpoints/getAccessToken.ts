import { dumbahhSpotifyTotp } from "../stuff/dumbahhSpotifyTotp";
import { maybeThrow, orThrow } from "../stuff/maybeThrow";
import { AccessToken } from "../types/AccessToken";
import { getServerTime } from "./serverTime";

export async function getAccessToken(i: RequestInit) {
    let { serverTime } = await getServerTime(i);


    return await fetch("https://open.spotify.com/get_access_token?"+ new URLSearchParams(Object.entries({
        reason: "init",
        productType: "web-player",
        totp: dumbahhSpotifyTotp(1e3 * serverTime).toString(),
        totpVer: "5",
        ts: serverTime.toString(),
    })), i)
    .then(maybeThrow)
    .then(r=>r.json())
    .then(orThrow)
    .then(r=>r as AccessToken);
}