import { lifeFilePath } from "./lifePaths.js";
import { readJsonFile, writeJsonFile } from "./localJsonStore.js";

const TODAY_FOCUS_FILE_PATH = lifeFilePath("todayFocus.json");

type TodayFocusData = {
  date: string; // YYYY-MM-DD
  smallWin: string;
  task: string;
  updatedAt: string; // ISO string
};

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export async function loadTodayFocus(): Promise<TodayFocusData | null> {
  const parsed = await readJsonFile<Partial<TodayFocusData>>(
    TODAY_FOCUS_FILE_PATH,
    {},
  );

  if (
    !isNonEmptyString(parsed.date) ||
    !isNonEmptyString(parsed.smallWin) ||
    !isNonEmptyString(parsed.task)
  ) {
    return null;
  }

  return {
    date: parsed.date.trim(),
    smallWin: parsed.smallWin.trim(),
    task: parsed.task.trim(),
    updatedAt: isNonEmptyString(parsed.updatedAt)
      ? parsed.updatedAt
      : new Date(0).toISOString(),
  };
}

export async function saveTodayFocus(input: {
  date: string;
  smallWin: string;
  task: string;
}) {
  const data: TodayFocusData = {
    date: input.date,
    smallWin: input.smallWin,
    task: input.task,
    updatedAt: new Date().toISOString(),
  };

  await writeJsonFile(TODAY_FOCUS_FILE_PATH, data);
}

export { TODAY_FOCUS_FILE_PATH };
