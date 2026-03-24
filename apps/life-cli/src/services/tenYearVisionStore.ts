import { lifeFilePath } from "./lifePaths.js";
import { readJsonFile, writeJsonFile } from "./localJsonStore.js";

const TEN_YEAR_VISION_FILE_PATH = lifeFilePath("tenYearVision.json");

const DEFAULT_TEN_YEAR_VISION = "未設定";

type TenYearVisionData = {
  vision: string;
  updatedAt: string; // ISO string
};

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export async function loadTenYearVision(): Promise<string> {
  const parsed = await readJsonFile<Partial<TenYearVisionData>>(
    TEN_YEAR_VISION_FILE_PATH,
    {},
  );

  if (!isNonEmptyString(parsed.vision)) {
    return DEFAULT_TEN_YEAR_VISION;
  }

  return parsed.vision.trim();
}

export async function saveTenYearVision(vision: string) {
  const data: TenYearVisionData = {
    vision: vision.trim(),
    updatedAt: new Date().toISOString(),
  };
  await writeJsonFile(TEN_YEAR_VISION_FILE_PATH, data);
}

export { TEN_YEAR_VISION_FILE_PATH, DEFAULT_TEN_YEAR_VISION };

