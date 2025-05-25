export type SpotifyClientToken = {
    token: string;
    expires_after_seconds?: number;
    refresh_after_seconds: number;
    domains?: {
        domain: string;
    }[];
}