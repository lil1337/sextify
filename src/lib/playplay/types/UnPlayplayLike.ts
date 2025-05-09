export type UnPlayplayLike = {
    token: Uint8Array,
    deobfuscateKey: (fileId: Uint8Array, key: Uint8Array) => Uint8Array
}