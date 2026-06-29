import { createCipheriv, createDecipheriv, randomBytes, createHash } from "crypto";

const ALG = "aes-256-gcm";

function key(): Buffer {
  const s = process.env.MONO_ENCRYPTION_KEY ?? "";
  if (!s) throw new Error("MONO_ENCRYPTION_KEY must be set");
  return createHash("sha256").update(s, "utf8").digest();
}

export function encrypt(text: string): string {
  const iv = randomBytes(12); 
  const cipher = createCipheriv(ALG, key(), iv);
  const enc = Buffer.concat([cipher.update(text, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `${iv.toString("hex")}:${tag.toString("hex")}:${enc.toString("hex")}`;
}

export function decrypt(payload: string): string {
  const [ivHex, tagHex, dataHex] = payload.split(":");
  const decipher = createDecipheriv(ALG, key(), Buffer.from(ivHex, "hex"));
  decipher.setAuthTag(Buffer.from(tagHex, "hex"));
  return Buffer.concat([
    decipher.update(Buffer.from(dataHex, "hex")),
    decipher.final(),
  ]).toString("utf8");
}