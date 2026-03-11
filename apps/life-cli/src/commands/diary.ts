import chalk from "chalk";
import { diaryPrompt } from "../prompts/diaryPrompt.js";
import { addMemo } from "../services/notionMemo.js";
import { runFramedCommand } from '../utils/commandFrame.js';

export async function runDiary() {
  await runFramedCommand(async () => {
    const { content } = await diaryPrompt();
    await addMemo(content, "日記");
    console.log(chalk.green("✔ diary added"))
  });
}
