import path from "path";

export const LIFE_DIR = path.join(process.env.HOME ?? process.cwd(), ".life-cli");

export function lifeFilePath(fileName: string) {
  return path.join(LIFE_DIR, fileName);
}

