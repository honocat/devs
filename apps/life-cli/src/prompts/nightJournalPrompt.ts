import inquirer from "inquirer";
import chalk from "chalk";
import type {
  FocusReflectionStatus,
  NightJournalPayload,
  TodayFocus,
} from "../types/journal.js";
import { optionalTrim } from "../utils/strings.js";

const STATUS_CHOICES: FocusReflectionStatus[] = [
  "達成",
  "一部達成",
  "未達",
  "未設定",
];

export async function nightJournalPrompt(input: {
  today: string;
  focus: TodayFocus | null;
}): Promise<NightJournalPayload> {
  const isTodayFocus = input.focus?.date === input.today;

  const baseAnswers = await inquirer.prompt([
    {
      type: "input",
      name: "gratitude",
      message: chalk.cyan("今日感謝したことを入力してください"),
      validate: (value: string) =>
        value.trim().length > 0 || "必須項目です。入力してください。",
    },
    {
      type: "input",
      name: "insight",
      message: chalk.cyan("今日気づき・成長を入力してください"),
      validate: (value: string) =>
        value.trim().length > 0 || "必須項目です。入力してください。",
    },
    {
      type: "input",
      name: "tomorrowTask",
      message: chalk.cyan("明日やることを入力してください"),
      validate: (value: string) =>
        value.trim().length > 0 || "必須項目です。入力してください。",
    },
    {
      type: "input",
      name: "note",
      message: chalk.cyan("自由記述（任意・スキップはEnter）"),
    },
    ...(isTodayFocus
      ? []
      : [
          {
            type: "input",
            name: "todaySmallWin",
            message: chalk.cyan(
              "今日の最低目標（朝に設定していない場合は任意・スキップはEnter）",
            ),
          },
          {
            type: "input",
            name: "todayTask",
            message: chalk.cyan(
              "今日やり遂げたいタスク（朝に設定していない場合は任意・スキップはEnter）",
            ),
          },
        ]),
  ]);

  const todaySmallWin = isTodayFocus
    ? input.focus?.smallWin
    : optionalTrim(baseAnswers.todaySmallWin);
  const todayTask = isTodayFocus
    ? input.focus?.task
    : optionalTrim(baseAnswers.todayTask);

  const smallWinStatus =
    todaySmallWin && todaySmallWin.length > 0
      ? ((
          await inquirer.prompt([
            {
              type: "list",
              name: "smallWinStatus",
              message: chalk.cyan("今日の最低目標の達成状況は？"),
              choices: STATUS_CHOICES,
              default: "未達",
            },
          ])
        ).smallWinStatus as FocusReflectionStatus)
      : "未設定";

  const taskStatus =
    todayTask && todayTask.length > 0
      ? ((
          await inquirer.prompt([
            {
              type: "list",
              name: "taskStatus",
              message: chalk.cyan("今日やり遂げたいタスクの達成状況は？"),
              choices: STATUS_CHOICES,
              default: "未達",
            },
          ])
        ).taskStatus as FocusReflectionStatus)
      : "未設定";

  return {
    gratitude: baseAnswers.gratitude.trim(),
    insight: baseAnswers.insight.trim(),
    tomorrowTask: baseAnswers.tomorrowTask.trim(),
    note: optionalTrim(baseAnswers.note),
    todaySmallWin,
    todayTask,
    smallWinStatus,
    taskStatus,
  };
}
