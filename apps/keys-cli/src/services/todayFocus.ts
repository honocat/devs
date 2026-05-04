import { keysFilePath } from "./keysDir.js";
import { readJsonFile, writeJsonFile } from "./localJsonStore.js";

const TODAY_FOCUS_FILE_PATH = keysFilePath("todayFocus.json");

export type TODAY_FOCUS_TYPE = {
  date: string;
  smallWin: string;
  task: string;
};

// `true` を返したときのみ、 `value` は `string` だと判断
function checkTodayFocus(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export async function loadTodayFocus(): Promise<TODAY_FOCUS_TYPE | null> {
  const parsed = await readJsonFile<Partial<TODAY_FOCUS_TYPE>>(
    TODAY_FOCUS_FILE_PATH,
    {},
  );
  if (
    !checkTodayFocus(parsed.date) ||
    !checkTodayFocus(parsed.smallWin) ||
    !checkTodayFocus(parsed.task)
  ) {
    return null;
  }
  return {
    date: parsed.date.trim(),
    smallWin: parsed.smallWin.trim(),
    task: parsed.task.trim(),
  };
}

export async function saveTodayFocus(input: TODAY_FOCUS_TYPE) {
  const data = {
    date: input.date,
    smallWin: input.smallWin,
    task: input.task,
  };
  await writeJsonFile(TODAY_FOCUS_FILE_PATH, data);
}
