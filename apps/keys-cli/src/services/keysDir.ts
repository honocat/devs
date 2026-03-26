import path from "path";

const KEYS_DIR = path.join(process.env.HOME ?? process.cwd(), ".keys-cli");

export function keysFilePath(fileName: string) {
  return path.join(KEYS_DIR, fileName);
}
