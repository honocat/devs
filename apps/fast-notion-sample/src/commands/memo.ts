import chalk from "chalk";
import { memoPrompt } from "../prompts/memoPrompt.js";
import { addMemo } from "../services/notionMemo.js";

export async function runMemo() {
  const { title } = await memoPrompt();
  await addMemo(title);
  console.log(chalk.green("memo added"));
}
