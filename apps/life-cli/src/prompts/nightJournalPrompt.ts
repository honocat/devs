import inquirer from "inquirer";
import chalk from "chalk";

export type NightJournalAnswers = {
  gratitude: string;
  insight: string;
  tomorrowTask: string;
  note?: string;
};

export async function nightJournalPrompt(): Promise<NightJournalAnswers> {
  const answers = await inquirer.prompt([
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
  ]);

  return {
    gratitude: answers.gratitude.trim(),
    insight: answers.insight.trim(),
    tomorrowTask: answers.tomorrowTask.trim(),
    note: answers.note?.trim() || undefined,
  };
}
