const {
  createCipheriv,
  createDecipheriv,
  randomBytes,
  scryptSync,
} = require("crypto");

const key = "3ce3bb19caa135a58142e1621b98a4e4";
const iv = "1a2b3c4dd4c3b2a1";

export function encrypt(text: string): string {
  const cipher = createCipheriv("aes-256-cbc", key, iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return encrypted;
}

export function decrypt(text: string): string {
  const decipher = createDecipheriv("aes-256-cbc", key, iv);
  let decrypted = decipher.update(text, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

export function hash(text: string): string {
  const salt = randomBytes(16).toString("hex");
  const constantSalt = "Yeah bro 69420 8===D";
  const hashed = scryptSync(text + constantSalt, salt, 64).toString("hex");
  return `${salt}|${hashed}`;
}
