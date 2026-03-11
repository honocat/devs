import chalk from "chalk";
import { memoPrompt } from "../prompts/memoPrompt.js";
import { addMemo } from "../services/notionMemo.js";
import { runFramedCommand } from '../utils/commandFrame.js';

export async function runMemo() {
  await runFramedCommand(async () => {
    const { title } = await memoPrompt();
    await addMemo(title, "タスク");
    console.log(chalk.green("✔ memo added"));
  });
}
