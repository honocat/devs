import { keysFilePath } from "./keysDir.js";
import { readJsonFile, writeJsonFile } from "./localJsonStore.js";

const LIFE_GOAL_FILE_PATH = keysFilePath("lifeGoal.json");
const YEARLY_GOAL_FILE_PATH = keysFilePath("yearlyGoal.json");
const MONTHLY_GOAL_FILE_PATH = keysFilePath("monthlyGoal.json");

const DEFAULT_GOAL = "目標はまだ設定されていません";

type GoalType = {
  goal: string;
};

function checkGoal(parsed: GoalType): string {
  if (typeof parsed.goal !== "string" || parsed.goal.trim().length === 0)
    return DEFAULT_GOAL;
  return parsed.goal;
}

// load & save goals function
async function loadGoal(filePath: string): Promise<string> {
  const parsed = await readJsonFile<GoalType>(filePath, { goal: "" });
  return checkGoal(parsed);
}
async function saveGoal(filePath: string, goal: string) {
  await writeJsonFile(filePath, { goal });
}

// load & save life goal
export async function loadLifeGoal(): Promise<string> {
  return loadGoal(LIFE_GOAL_FILE_PATH);
}
export async function saveLifeGoal(goal: string) {
  await saveGoal(LIFE_GOAL_FILE_PATH, goal);
}

// laod & save yearly goal
export async function loadYearlyGoal(): Promise<string> {
  return loadGoal(YEARLY_GOAL_FILE_PATH);
}
export async function saveYearlyGoal(goal: string) {
  await writeJsonFile(YEARLY_GOAL_FILE_PATH, { goal });
}

// laod & save monthly goal
export async function loadMonthlyGoal(): Promise<string> {
  return loadGoal(MONTHLY_GOAL_FILE_PATH);
}
export async function saveMonthlyGoal(goal: string) {
  await writeJsonFile(MONTHLY_GOAL_FILE_PATH, { goal });
}
