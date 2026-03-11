import { diaryPrompt } from "../prompts/diaryPrompt.js";
import { addMemo } from "../services/notionMemo.js";
import chalk from "chalk";

export async function runDiary() {
  console.log(chalk.gray("────────────────"));
  const { content } = await diaryPrompt();

  await addMemo(content, "日記");

  console.log(chalk.green("✔ diary added"));
  console.log(chalk.gray("────────────────"));
}
