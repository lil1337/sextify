import { SpotifyError } from "lib/errors";
import { getAccessToken } from "../applicationEndpoints/getAccessToken";
import { AccessToken } from "../types/AccessToken";
import { AuthenticatedRequestInit } from "../types/AuthenticatedRequestInit";
import { sessionHeaders } from "./headers";

export async function ensureAuth(o: {cookies?: string, token?: Partial<AccessToken> & {accessToken: string}}): Promise<{r: AuthenticatedRequestInit, token?: AccessToken}>{
    let r: RequestInit = { headers: {
        ...sessionHeaders, 
        "cookie": o.cookies, 
    } };

    let newToken: AccessToken = undefined;
    if (o.cookies){
        if (!o.token || (o.token?.accessTokenExpirationTimestampMs && o.token?.accessTokenExpirationTimestampMs < Date.now())){
            newToken = await getAccessToken(r);
            if (newToken.isAnonymous) throw new SpotifyError("Failed to authenticate, got an anonymous token. Try updating cookies");
        }
    }

    if (o.token) (r as AuthenticatedRequestInit).headers.authorization = `Bearer ${o.token.accessToken}`;
    return {r: r as AuthenticatedRequestInit, token: newToken};
}