import inquirer from "inquirer";
import chalk from "chalk";

export async function diaryPrompt() {
  const answers = await inquirer.prompt([
    {
      type: "input",
      name: "content",
      message: chalk.cyan("日記を書いてください"),
    },
  ]);

  return answers;
}
