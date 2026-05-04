import inquirer from "inquirer";
import chalk from "chalk";
import type { TODAY_FOCUS_TYPE } from "../services/todayFocus.js";

export async function goalUpdatePrompt(currentGoal: string) {
  const { shouldUpdate } = await inquirer.prompt([
    {
      type: "confirm",
      name: "shouldUpdate",
      message: chalk.yellow("生涯目標を修正・更新しますか？"),
      default: false,
    },
  ]);

  if (!shouldUpdate) return null;

  const { nextGoal } = await inquirer.prompt([
    {
      type: "input",
      name: "nextGoal",
      message: chalk.cyan("新しい生涯目標を入力してください"),
      default: currentGoal,
    },
  ]);

  return nextGoal as string;
}

export type MorningJournalAnswers = {
  target3M: string;
  smallWin: string;
  task: string;
  idea: string;
};

export async function morningJournalPropmt(): Promise<MorningJournalAnswers> {
  const answers = await inquirer.prompt([
    {
      type: "input",
      name: "target3M",
      message: chalk.cyan("Q1. 直近3か月で達成する目標はなんですか？"),
    },
    {
      type: "input",
      name: "smallWin",
      message: chalk.cyan("Q2. 今日の最低目標は？"),
    },
    {
      type: "input",
      name: "task",
      message: chalk.cyan("Q3. 今日やり遂げたいタスクを1つ書いてください。"),
    },
    {
      type: "input",
      name: "idea",
      message: chalk.cyan("Q4. 理想の自分は、今日という日をどう過ごしますか？"),
    },
  ]);

  return {
    target3M: answers.target3M,
    smallWin: answers.smallWin,
    task: answers.task,
    idea: answers.idea,
  };
}

export type NightJournalAnswers = {
  tenYearVision: string;
  yearlyGoal: string;
  gratitude: string;
  insight: string;
  todayTaskResult: "未達" | "一部達成" | "達成" | undefined;
  todayTaskRefrection: string | undefined;
  tomorrowTask: string;
  freeWriting?: string;
};

export async function nightJournalPrompt(input: {
  today: string;
  focus: TODAY_FOCUS_TYPE | null;
  tenYearsLaterLabel: string;
}): Promise<NightJournalAnswers> {
  const isTodayFocus = input.focus?.date === input.today;
  const answers = await inquirer.prompt([
    {
      type: "input",
      name: "tenYearVision",
      message: chalk.cyan(
        `Q1. ${input.tenYearsLaterLabel}どうなっていたいですか？`,
      ),
      validate: (value: string) =>
        value.trim().length > 0 || "必須項目です。入力してください。",
    },
    {
      type: "input",
      name: "yearlyGoal",
      message: chalk.cyan("Q2. そのためにこの1年何を目標にしますか？"),
      validate: (value: string) =>
        value.trim().length > 0 || "必須項目です。入力してください。",
    },
    {
      type: "input",
      name: "gratitude",
      message: chalk.cyan("Q3. 今日は何に感謝しましたか？"),
      validate: (value: string) =>
        value.trim().length > 0 || "必須項目です。入力してください。",
    },
    {
      type: "input",
      name: "insight",
      message: chalk.cyan("Q4. 今日の気づき・成長はなんですか？"),
      validate: (value: string) =>
        value.trim().length > 0 || "必須項目です。入力してください。",
    },
    ...(isTodayFocus
      ? [
          {
            type: "rawlist",
            name: "todayTaskResult",
            message: chalk.cyan("Q5-1. 今日のタスクは達成しましたか？"),
            choices: ["達成", "一部達成", "未達"],
            default: "達成",
          },
          {
            type: "input",
            name: "todayTaskReflection",
            message: chalk.cyan(
              "Q5-1. タスクの振り返り（どこが良かったか・悪かったか）",
            ),
            validate: (value: string) =>
              value.trim().length > 0 || "必須項目です。入力してください。",
          },
        ]
      : []),
    {
      type: "input",
      name: "tomorrowTask",
      message: chalk.cyan("Q6. 明日やり遂げたいタスクを入力してください"),
      validate: (value: string) =>
        value.trim().length > 0 || "必須項目です。入力してください。",
    },
    {
      type: "input",
      name: "freeWriting",
      message: chalk.cyan("今の思いを自由に記述してください"),
      default: "Press Enter to skip",
    },
  ]);

  return {
    tenYearVision: answers.tenYearVision,
    yearlyGoal: answers.yearlyGoal,
    gratitude: answers.gratitude,
    insight: answers.insight,
    todayTaskResult: answers.todayTaskResult,
    todayTaskRefrection: answers.todayTaskReflection,
    tomorrowTask: answers.tomorrowTask,
    freeWriting: answers.freeWriting,
  };
}
