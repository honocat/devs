import inquirer from "inquirer";
import chalk from "chalk";

export async function memoPrompt(): Promise<{ title: string }> {
  const answers = await inquirer.prompt([
    {
      type: "input",
      name: "title",
      message: chalk.cyan("メモを入力してください"),
    },
  ]);
  return answers;
}
