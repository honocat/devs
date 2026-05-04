import fs from "fs/promises";
import path from "path";

// read
// `T` はジェネリック関数。呼び出し側が型を決定できる
export async function readJsonFile<T>(
  filePath: string,
  fallback: T,
): Promise<T> {
  try {
    const raw = await fs.readFile(filePath, "utf-8");
    // JSONファイルは `string`, `number`, `array`, ... など
    // 様々な型が予測されるため `as T` が必要
    return JSON.parse(raw) as T;
  } catch {
    // error時は `fallback` に指定した値をそのまま返す
    return fallback;
  }
}

// write
export async function writeJsonFile(filePath: string, data: unknown) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
}
