import { lifeFilePath } from "./lifePaths.js";
import { readJsonFile, writeJsonFile } from "./localJsonStore.js";

const LIFE_GOAL_FILE_PATH = lifeFilePath("lifeGoal.json");
const YEARLY_GOAL_FILE_PATH = lifeFilePath("yearlyGoal.json");
const MONTHLY_GOAL_FILE_PATH = lifeFilePath("monthlyGoal.json");

const DEFAULT_GOAL = "まだ生涯目標は設定されていません。";

type GoalConfig = {
  goal: string;
};

function normalizeGoal(parsed: GoalConfig) {
  if (typeof parsed.goal !== "string" || parsed.goal.trim().length === 0) {
    return DEFAULT_GOAL;
  }

  return parsed.goal;
}

async function loadGoal(filePath: string) {
  const parsed = await readJsonFile<GoalConfig>(filePath, { goal: "" });
  return normalizeGoal(parsed);
}

async function saveGoal(filePath: string, goal: string) {
  await writeJsonFile(filePath, { goal });
}

export async function loadLifeGoal() {
  return loadGoal(LIFE_GOAL_FILE_PATH);
}

export async function saveLifeGoal(goal: string) {
  await saveGoal(LIFE_GOAL_FILE_PATH, goal);
}

export async function loadYearlyGoal() {
  return loadGoal(YEARLY_GOAL_FILE_PATH);
}

export async function saveYearlyGoal(goal: string) {
  await saveGoal(YEARLY_GOAL_FILE_PATH, goal);
}

export async function loadMonthlyGoal() {
  return loadGoal(MONTHLY_GOAL_FILE_PATH);
}

export async function saveMonthlyGoal(goal: string) {
  await saveGoal(MONTHLY_GOAL_FILE_PATH, goal);
}

export { LIFE_GOAL_FILE_PATH, DEFAULT_GOAL };
