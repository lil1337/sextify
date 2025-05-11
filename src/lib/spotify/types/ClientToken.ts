export type ClientToken = {
    token: string;
    expires_after_seconds?: number;
    refresh_after_seconds: number;
    domains?: {
        domain: string;
    }[];
}