const { createCipheriv, createDecipheriv } = require("crypto");

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
