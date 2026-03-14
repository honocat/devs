import fs from "fs/promises";
import path from "path";

const LIFE_DIR = path.join(process.env.HOME ?? process.cwd(), ".life-cli");
const LIFE_GOAL_FILE_PATH = path.join(LIFE_DIR, "lifeGoal.json");
const YEARLY_GOAL_FILE_PATH = path.join(LIFE_DIR, "yearlyGoal.json");
const MONTHLY_GOAL_FILE_PATH = path.join(LIFE_DIR, "monthlyGoal.json");

const DEFAULT_GOAL = "まだ生涯目標は設定されていません。";

type GoalConfig = {
  goal: string;
};

export async function loadLifeGoal() {
  try {
    const raw = await fs.readFile(LIFE_GOAL_FILE_PATH, "utf-8");
    const parsed = JSON.parse(raw) as GoalConfig;

    console.log(parsed);
    console.log(parsed.goal);

    if (typeof parsed.goal !== "string" || parsed.goal.trim().length === 0) {
      return DEFAULT_GOAL;
    }

    return parsed.goal;
  } catch {
    return DEFAULT_GOAL;
  }
}

export async function saveLifeGoal(goal: string) {
  await fs.mkdir(LIFE_DIR, { recursive: true });
  await fs.writeFile(
    LIFE_GOAL_FILE_PATH,
    JSON.stringify({ goal }, null, 2),
    "utf-8",
  );
}

export async function loadYearlyGoal() {
  try {
    const raw = await fs.readFile(YEARLY_GOAL_FILE_PATH, "utf-8");
    const parsed = JSON.parse(raw) as GoalConfig;

    if (typeof parsed.goal !== "string" || parsed.goal.trim().length === 0) {
      return DEFAULT_GOAL;
    }

    return parsed.goal;
  } catch {
    return DEFAULT_GOAL;
  }
}

export async function saveYearlyGoal(goal: string) {
  await fs.mkdir(LIFE_DIR, { recursive: true });
  await fs.writeFile(
    YEARLY_GOAL_FILE_PATH,
    JSON.stringify({ goal }, null, 2),
    "utf-8",
  );
}

export async function loadMonthlyGoal() {
  try {
    const raw = await fs.readFile(MONTHLY_GOAL_FILE_PATH, "utf-8");
    const parsed = JSON.parse(raw) as GoalConfig;

    if (typeof parsed.goal !== "string" || parsed.goal.trim().length === 0) {
      return DEFAULT_GOAL;
    }

    return parsed.goal;
  } catch {
    return DEFAULT_GOAL;
  }
}

export async function saveMonthlyGoal(goal: string) {
  await fs.mkdir(LIFE_DIR, { recursive: true });
  await fs.writeFile(
    MONTHLY_GOAL_FILE_PATH,
    JSON.stringify({ goal }, null, 2),
    "utf-8",
  );
}

export { LIFE_GOAL_FILE_PATH, DEFAULT_GOAL };
