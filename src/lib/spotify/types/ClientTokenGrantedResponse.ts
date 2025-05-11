export type ClientTokenGrantedResponse = {
    response_type: "RESPONSE_GRANTED_TOKEN_RESPONSE";
    granted_token: {
        token: string;
        expires_after_seconds: number;
        refresh_after_seconds: number;
        domains: {
            domain: string;
        }[];
    };
};
