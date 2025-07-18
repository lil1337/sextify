declare function base(ALPHABET: string): base.BaseConverter;
export default base;
declare namespace base {
    interface BaseConverter {
        encode(buffer: Uint8Array | number[]): string;
        decodeUnsafe(string: string): Uint8Array | undefined;
        decode(string: string): Uint8Array;
    }
}