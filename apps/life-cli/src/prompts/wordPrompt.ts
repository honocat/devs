import inquirer from "inquirer";
import chalk from "chalk";

export async function wordPrompt(): Promise<{ name: string }> {
  const answers = await inquirer.prompt([
    {
      type: "input",
      name: "name",
      message: chalk.cyan("語句（名前）を入力してください"),
      validate: (value: unknown) => {
        if (typeof value !== "string" || value.trim().length === 0) {
          return "空欄は不可です";
        }
        return true;
      },
      filter: (value: unknown) =>
        typeof value === "string" ? value.trim() : value,
    },
  ]);

  return { name: answers.name as string };
}

