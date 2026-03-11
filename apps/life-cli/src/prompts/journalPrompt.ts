import inquirer from "inquirer";
import chalk from "chalk";

export type JournalAnswers = {
  targetY: string;
  target3M: string;
  smallWin: string;
  task: string;
  idea: string;
};

export async function journalPrompt(): Promise<JournalAnswers> {
  const answers = await inquirer.prompt([
    {
      type: "input",
      name: "targetY",
      message: chalk.cyan(
        "Q1. 生涯目標を達成するために、今年1年何を目標にしますか？",
      ),
    },
    {
      type: "input",
      name: "target3M",
      message: chalk.cyan("Q2. 直近3ヶ月で達成する目標はなんですか？"),
    },
    {
      type: "input",
      name: "smallWin",
      message: chalk.cyan("Q4. 今日の最低目標は？"),
    },
    {
      type: "input",
      name: "task",
      message: chalk.cyan("Q3. 今日やり遂げたいタスクを1つ書いてください。"),
    },

    {
      type: "input",
      name: "idea",
      message: chalk.cyan("Q5. 理想の自分は、今日という日をどう過ごしますか？"),
    },
  ]);

  return {
    targetY: answers.targetY,
    target3M: answers.target3M,
    smallWin: answers.smallWin,
    task: answers.task,
    idea: answers.idea,
  };
}

export async function goalUpdatePrompt(currentGoal: string) {
  const { shouldUpdate } = await inquirer.prompt([
    {
      type: "confirm",
      name: "shouldUpdate",
      message: chalk.yellow("目標を修正・更新しますか？"),
      default: false,
    },
  ]);

  if (!shouldUpdate) {
    return null;
  }

  const { nextGoal } = await inquirer.prompt([
    {
      type: "input",
      name: "nextGoal",
      message: chalk.cyan("新しい生涯目標を入力してください"),
      default: currentGoal,
    },
  ]);

  return nextGoal as string;
}
