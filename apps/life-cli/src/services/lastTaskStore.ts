import fs from "fs/promises";
import path from "path";

const LIFE_DIR = path.join(process.env.HOME ?? process.cwd(), ".life-cli");
const LAST_TASK_FILE_PATH = path.join(LIFE_DIR, "lastTask.json");

const DEFAULT_LAST_TASK = {
  tomorrowTask: "今日やることは設定されていません。",
  updatedAt: "",
};

type LastTaskData = {
  tomorrowTask: string;
  updatedAt: string;
};

export async function loadLastTask(): Promise<LastTaskData | null> {
  try {
    const raw = await fs.readFile(LAST_TASK_FILE_PATH, "utf-8");
    const parsed = JSON.parse(raw) as Partial<LastTaskData>;

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
  } catch {
    return DEFAULT_LAST_TASK;
  }
}

export async function saveLastTask(tomorrowTask: string) {
  const data: LastTaskData = {
    tomorrowTask,
    updatedAt: new Date().toISOString(),
  };

  await fs.mkdir(LIFE_DIR, { recursive: true });
  await fs.writeFile(
    LAST_TASK_FILE_PATH,
    JSON.stringify(data, null, 2),
    "utf-8",
  );
}
