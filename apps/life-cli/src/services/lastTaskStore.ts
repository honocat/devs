import { lifeFilePath } from "./lifePaths.js";
import { readJsonFile, writeJsonFile } from "./localJsonStore.js";

const LAST_TASK_FILE_PATH = lifeFilePath("lastTask.json");

const DEFAULT_LAST_TASK = {
  tomorrowTask: "今日やることは設定されていません。",
  updatedAt: "",
};

type LastTaskData = {
  tomorrowTask: string;
  updatedAt: string;
};

export async function loadLastTask(): Promise<LastTaskData> {
  const parsed = await readJsonFile<Partial<LastTaskData>>(
    LAST_TASK_FILE_PATH,
    {},
  );

  if (typeof parsed.tomorrowTask !== "string") {
    return DEFAULT_LAST_TASK;
  }

  return {
    tomorrowTask: parsed.tomorrowTask,
    updatedAt:
      typeof parsed.updatedAt === "string"
        ? parsed.updatedAt
        : new Date(0).toISOString(),
  };
}

export async function saveLastTask(tomorrowTask: string) {
  const data: LastTaskData = {
    tomorrowTask,
    updatedAt: new Date().toISOString(),
  };

  await writeJsonFile(LAST_TASK_FILE_PATH, data);
}
