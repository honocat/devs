import inquirer from "inquirer";
import chalk from "chalk";

export async function wordPrompt(): Promise<{ name: string }> {
  const answers = await inquirer.prompt([
    {
      type: "input",
      name: "name",
      message: chalk.cyan("語句を入力してください"),
    },
  ]);
  return answers;
}
