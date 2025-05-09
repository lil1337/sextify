export type AccessToken = {  
    clientId: string,
    accessToken: string,
    accessTokenExpirationTimestampMs: number,
    isAnonymous: boolean,
    totpValidity: boolean,
    /**
     * You wouldn't steal a car
     */
    _notes: 'Usage of this endpoint is not permitted under the Spotify Developer Terms and Developer Policy, and applicable law'
}