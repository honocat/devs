import chalk from "chalk";
import { balancePrompt } from "../prompts/balancePrompt.js";
import { addBalance } from "../services/notionBalance.js";
import { runFramedCommand } from '../utils/commandFrame.js';

export async function runBalance() {
  await runFramedCommand(async () => {
    const { item, amount } = await balancePrompt();
    await addBalance(item, amount);
    console.log(chalk.green("✔ balance added"))
  })
}
