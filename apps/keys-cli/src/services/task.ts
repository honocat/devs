import { keysFilePath } from "./keysDir.js";
import { readJsonFile, writeJsonFile } from "./localJsonStore.js";

const TASK_FILE_PATH = keysFilePath("task.json");

const DEFAULT_TASK = "タスクが未設定です";

type TaskType = {
  task: string;
};

function checkTask(parsed: TaskType): string {
  if (typeof parsed.task !== "string" || parsed.task.trim().length === 0)
    return DEFAULT_TASK;
  return parsed.task;
}

export async function loadTodayTask(): Promise<string> {
  const parsed = await readJsonFile<TaskType>(TASK_FILE_PATH, { task: "" });
  return checkTask(parsed);
}

export async function saveTomorrowTask(task: string) {
  await writeJsonFile(TASK_FILE_PATH, { task });
}
