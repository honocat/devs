import inquirer from "inquirer";
import chalk from "chalk";

export async function balancePrompt() {
  const answers = await inquirer.prompt([
    {
      type: "input",
      name: "item",
      message: chalk.cyan("品目"),
    },
    {
      type: "number",
      name: "amount",
      message: chalk.cyan("金額"),
    },
  ]);

  return answers;
}
