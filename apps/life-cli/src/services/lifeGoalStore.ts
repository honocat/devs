import fs from "fs/promises";
import path from "path";

const GOAL_DIR = path.join(process.env.HOME ?? process.cwd(), ".life-cli");
const GOAL_FILE_PATH = path.join(GOAL_DIR, "goal.json");

const DEFAULT_GOAL = "まだ生涯目標は設定されていません。";

type GoalConfig = {
  lifeGoal: string;
};

export async function loadLifeGoal() {
  try {
    const raw = await fs.readFile(GOAL_FILE_PATH, "utf-8");
    const parsed = JSON.parse(raw) as GoalConfig;

    if (
      typeof parsed.lifeGoal !== "string" ||
      parsed.lifeGoal.trim().length === 0
    ) {
      return DEFAULT_GOAL;
    }

    return parsed.lifeGoal;
  } catch {
    return DEFAULT_GOAL;
  }
}

export async function saveLifeGoal(lifeGoal: string) {
  await fs.mkdir(GOAL_DIR, { recursive: true });
  await fs.writeFile(
    GOAL_FILE_PATH,
    JSON.stringify({ lifeGoal }, null, 2),
    "utf-8",
  );
}

export { GOAL_FILE_PATH, DEFAULT_GOAL };
