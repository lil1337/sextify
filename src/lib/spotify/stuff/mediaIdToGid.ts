import base from "./base-x";

export const mediaIdToGid = (mediaId: string) => {
    let gid = Buffer.from(
        base("0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ").decodeUnsafe(mediaId)
    )
    .toString('hex').padStart(32, '0');

    if (gid.length == 34) gid = gid.slice(2, 34);

    return gid;
}