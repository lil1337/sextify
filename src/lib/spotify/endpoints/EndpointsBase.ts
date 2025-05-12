import type { SpotifyApi } from "..";
import { PathfinderClient } from "../types/PathfinderClient";

export default class EndpointsBase {
    constructor(protected api: unknown & {
        makeRequest: typeof SpotifyApi.prototype.makeRequest,
        ensureAuth: typeof SpotifyApi.prototype.ensureAuth,
        ensureClientToken: typeof SpotifyApi.prototype.ensureClientToken
    } & PathfinderClient) {
    }

    public async getRequest<TReturnType>(url: string): Promise<TReturnType> {
        return await this.api.makeRequest<TReturnType>("GET", url);
    }

    public async postRequest<TReturnType, TBody = unknown>(url: string, body?: TBody, contentType: string | undefined = undefined): Promise<TReturnType> {
        return await this.api.makeRequest<TReturnType>("POST", url, body, contentType);
    }

    public async putRequest<TReturnType, TBody = unknown>(url: string, body?: TBody, contentType: string | undefined = undefined): Promise<TReturnType> {
        return await this.api.makeRequest<TReturnType>("PUT", url, body, contentType);
    }

    public async deleteRequest<TReturnType, TBody = unknown>(url: string, body?: TBody): Promise<TReturnType> {
        return await this.api.makeRequest<TReturnType>("DELETE", url, body);
    }

    public paramsFor(args: any) {
        const params = new URLSearchParams();
        for (let key of Object.getOwnPropertyNames(args)) {
            if (args[key] || (args[key] === 0) || (!args[key] && typeof args[key] === 'boolean')) {
                params.append(key, args[key].toString());
            }
        }
        return [...params].length > 0 ? `?${params.toString()}` : "";
    }
}

