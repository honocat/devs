import { memoPrompt } from "../prompts/memoPrompt.js";
import { addMemo } from "../services/notionMemo.js";
import chalk from "chalk";

export async function runMemo() {
  console.log(chalk.gray("────────────────"));
  const { title } = await memoPrompt();

  await addMemo(title, "タスク");

  console.log(chalk.green("✔ memo added"));
  console.log(chalk.gray("────────────────"));
}
