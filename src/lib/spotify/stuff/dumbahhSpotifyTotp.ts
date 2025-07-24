import * as crypto from 'crypto';


export function dumbahhSpotifyTotp(timestamp: number): string {
  const secretSauce = new Uint8Array(Buffer.from("co/X18vA4C2hue7^_K^1E$U@J<", "ascii"))
    .map((n, i) => n ^ ((i % 33) + 9))
    .map((n) => n.toString())
    .join("");

  const secretBytes: string[] = [];
  Buffer.from(secretSauce, "utf8")
    .forEach((n) => secretBytes.push(n.toString(16)));

  const secret = Buffer.from(secretBytes.join(""), "hex")

  const period = 30;
  const digits = 6;

  const counter = Math.floor(timestamp / 1000 / period);
  const counterBuffer = Buffer.alloc(8);
  counterBuffer.writeBigUInt64BE(BigInt(counter));

  const hmac = crypto.createHmac('sha1', secret).update(counterBuffer).digest();

  const offset = hmac[hmac.length - 1] & 0x0f;

  const binary =
    ((hmac[offset] & 0x7f) << 24) |
    ((hmac[offset + 1] & 0xff) << 16) |
    ((hmac[offset + 2] & 0xff) << 8) |
    (hmac[offset + 3] & 0xff);

  const otp = binary % 10 ** digits;
  return otp.toString().padStart(digits, '0');
}
