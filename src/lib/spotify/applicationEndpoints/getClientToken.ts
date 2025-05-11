import { dumbahhSpotifyTotp } from "../stuff/dumbahhSpotifyTotp";
import { maybeThrow, orThrow } from "../stuff/maybeThrow";
import { AccessToken } from "../types/AccessToken";
import { ClientTokenGrantedResponse } from "../types/ClientTokenGrantedResponse";
import { getServerTime } from "./serverTime";


export async function getClientToken() {
    return fetch("https://clienttoken.spotify.com/v1/clienttoken", {
        method: "POST",

        body: JSON.stringify({
            "client_data": {
                "client_version": "1.2.64.235.gbfa412f6",
                "client_id": "d8a5ed958d274c2e8ee717e6a4b0971d",
                "js_sdk_data": {
                    "device_brand": "Apple",
                    "device_model": "unknown",
                    "os": "macos",
                    "os_version": "10.15.7",
                    "device_id": "3b91fe55cf8173ff0bd86ce98b7bd0e5",
                    "device_type": "computer"
                }
            }
        }),
        headers: {
            "content-type": "application/json",
            accept: "application/json"
        },

    }).then(maybeThrow)
    .then(r=>r.json())
    .then(orThrow<ClientTokenGrantedResponse>)
}