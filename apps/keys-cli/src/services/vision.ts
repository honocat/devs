import { keysFilePath } from "./keysDir.js";
import { readJsonFile, writeJsonFile } from "./localJsonStore.js";

const TEN_YEAR_VISION_FILE_PATH = keysFilePath("tenYearVision.json");

const DEFAULT_VISION = "まだ設定されていません";

type VisionType = {
  vision: string;
};

function checkVision(parsed: VisionType): string {
  if (typeof parsed.vision !== "string" || parsed.vision.trim().length === 0)
    return DEFAULT_VISION;
  return parsed.vision;
}

async function loadVision(filePath: string): Promise<string> {
  const parsed = await readJsonFile<VisionType>(filePath, { vision: "" });
  return checkVision(parsed);
}

export async function loadTenYearVision(): Promise<string> {
  return loadVision(TEN_YEAR_VISION_FILE_PATH);
}

// save
export async function saveTenYearVision(vision: string) {
  await writeJsonFile(TEN_YEAR_VISION_FILE_PATH, { vision });
}
