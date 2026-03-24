import inquirer from "inquirer";
import chalk from "chalk";
import type { NightJournalPayload, TodayFocus } from "../types/journal.js";
import { optionalTrim } from "../utils/strings.js";

const RESULT_CHOICES: Array<NightJournalPayload["smallWinResult"]> = [
  "達成",
  "未達",
];

export async function nightJournalPrompt(input: {
  today: string;
  focus: TodayFocus | null;
  tenYearsLaterLabel: string;
}): Promise<NightJournalPayload> {
  const isTodayFocus = input.focus?.date === input.today;

  const baseAnswers = await inquirer.prompt([
    {
      type: "input",
      name: "tenYearVision",
      message: chalk.cyan(`1. ${input.tenYearsLaterLabel}どうなっていたいか`),
      validate: (value: string) =>
        value.trim().length > 0 || "必須項目です。入力してください。",
    },
    {
      type: "input",
      name: "oneYearGoal",
      message: chalk.cyan("2. そのためにこの1年何を目標にするか"),
      validate: (value: string) =>
        value.trim().length > 0 || "必須項目です。入力してください。",
    },
    {
      type: "input",
      name: "gratitude",
      message: chalk.cyan("3. 今日感謝したことはなにか"),
      validate: (value: string) =>
        value.trim().length > 0 || "必須項目です。入力してください。",
    },
    {
      type: "input",
      name: "insight",
      message: chalk.cyan("4. 今日の気づき・成長はなにか"),
      validate: (value: string) =>
        value.trim().length > 0 || "必須項目です。入力してください。",
    },
    ...(isTodayFocus
      ? []
      : [
          {
            type: "input",
            name: "todaySmallWin",
            message: chalk.cyan(
              "（未設定）今日の最低目標は？（Night Journalで設定）",
            ),
            validate: (value: string) =>
              value.trim().length > 0 || "必須項目です。入力してください。",
          },
          {
            type: "input",
            name: "todayTask",
            message: chalk.cyan(
              "（未設定）今日やり遂げたいタスクは？（Night Journalで設定）",
            ),
            validate: (value: string) =>
              value.trim().length > 0 || "必須項目です。入力してください。",
          },
        ]),
  ]);

  const todaySmallWin = isTodayFocus
    ? input.focus?.smallWin
    : optionalTrim(baseAnswers.todaySmallWin);
  const todayTask = isTodayFocus
    ? input.focus?.task
    : optionalTrim(baseAnswers.todayTask);

  const mustHaveTodayFocus =
    typeof todaySmallWin === "string" &&
    todaySmallWin.trim().length > 0 &&
    typeof todayTask === "string" &&
    todayTask.trim().length > 0;

  if (!mustHaveTodayFocus) {
    throw new Error(
      "今日の最低目標・タスクが未設定です（入力が必要です）。",
    );
  }

  console.log(chalk.cyan("\n5. 今日の最低目標・やるべきタスクの振り返り"));
  console.log(chalk.white(`最低目標: ${todaySmallWin}`));
  console.log(chalk.white(`タスク: ${todayTask}`));
  console.log();

  const smallWinResult = (
    await inquirer.prompt([
      {
        type: "list",
        name: "smallWinResult",
        message: chalk.cyan("5-1. 今日の最低目標は達成しましたか？"),
        choices: RESULT_CHOICES,
        default: "未達",
      },
    ])
  ).smallWinResult as NightJournalPayload["smallWinResult"];

  const { smallWinReflection } = await inquirer.prompt([
    {
      type: "input",
      name: "smallWinReflection",
      message: chalk.cyan(
        "5-2. 最低目標の振り返り（どこが良かった/悪かった？）",
      ),
      validate: (value: string) =>
        value.trim().length > 0 || "必須項目です。入力してください。",
    },
  ]);

  const taskResult = (
    await inquirer.prompt([
      {
        type: "list",
        name: "taskResult",
        message: chalk.cyan("5-3. タスクは達成しましたか？"),
        choices: RESULT_CHOICES,
        default: "未達",
      },
    ])
  ).taskResult as NightJournalPayload["taskResult"];

  const { taskReflection } = await inquirer.prompt([
    {
      type: "input",
      name: "taskReflection",
      message: chalk.cyan("5-4. タスクの振り返り（どこが良かった/悪かった？）"),
      validate: (value: string) =>
        value.trim().length > 0 || "必須項目です。入力してください。",
    },
  ]);

  const { tomorrowTask } = await inquirer.prompt([
    {
      type: "input",
      name: "tomorrowTask",
      message: chalk.cyan("6. 明日やることはなにか"),
      validate: (value: string) =>
        value.trim().length > 0 || "必須項目です。入力してください。",
    },
  ]);

  return {
    tenYearsLaterLabel: input.tenYearsLaterLabel,
    tenYearVision: baseAnswers.tenYearVision.trim(),
    oneYearGoal: baseAnswers.oneYearGoal.trim(),
    gratitude: baseAnswers.gratitude.trim(),
    insight: baseAnswers.insight.trim(),
    smallWinResult,
    smallWinReflection: (smallWinReflection as string).trim(),
    taskResult,
    taskReflection: (taskReflection as string).trim(),
    tomorrowTask: (tomorrowTask as string).trim(),
    todaySmallWin,
    todayTask,
  };
}
