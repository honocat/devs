import { balancePrompt } from "../prompts/balancePrompt.js";
import { addBalance } from "../services/notionBalance.js";
import chalk from "chalk";

export async function runBalance() {
  console.log(chalk.gray("────────────────"));
  const { item, amount } = await balancePrompt();

  await addBalance(item, amount);

  console.log(chalk.green("✔ balance added"));
  console.log(chalk.gray("────────────────"));
}
