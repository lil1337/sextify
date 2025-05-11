import { SpotifyError } from "lib/errors";
import { getAccessToken } from "../applicationEndpoints/getAccessToken";
import { AccessToken } from "../types/AccessToken";
import { AuthenticatedRequestInit } from "../types/AuthenticatedRequestInit";
import { ClientToken } from "../types/ClientToken";
import { getClientToken } from "../applicationEndpoints/getClientToken";

export async function ensureClientToken(init: AuthenticatedRequestInit, token?: ClientToken): Promise<{r: AuthenticatedRequestInit, token?: ClientToken}>{
    let r: RequestInit = {...init,  headers: {
        ...init.headers,
        "client-token": token?.token,
        "spotify-app-version": "1.2.64.235.gbfa412f6"
    } };

    
    if (!token || (token?.refresh_after_seconds && token?.refresh_after_seconds < Date.now()))
        token = (await getClientToken()).granted_token;
    

    if (token) (r as AuthenticatedRequestInit).headers["client-token"] = token.token;
    return {r: r as AuthenticatedRequestInit, token};
}