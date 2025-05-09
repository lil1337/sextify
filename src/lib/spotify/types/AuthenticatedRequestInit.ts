export type AuthenticatedRequestInit = RequestInit & {
    headers: RequestInit['headers'] & {
        'authorization': string;
    };
}