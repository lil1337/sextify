import { SpotifyStreamError } from 'lib/errors';

export function parsePlayplayLicenseResponse(response: Buffer) {
    let length = response[1];
    if (response.length < length + 2) return {obfuscatedKey: null};
    return {obfuscatedKey: new Uint8Array(response.subarray(2, length + 2))};
}