import inquirer from "inquirer";
import chalk from "chalk";
import { optionalTrim } from "../utils/strings.js";

export type JapaneseEssayAnswers = {
  japanese: string;
};

export type EnglishEssayAnswers = {
  english: string;
};

export async function japaneseEssayPrompt(): Promise<JapaneseEssayAnswers> {
  const answers = await inquirer.prompt([
    {
      type: "input",
      name: "japanese",
      message: chalk.cyan(
        "日本語で文章を書いてください（トピック自由・1文でもOK）",
      ),
      validate: (value: unknown) => {
        if (!optionalTrim(value)) {
          return "空は不可です。";
        }
        return true;
      },
    },
  ]);

  return { japanese: (answers.japanese as string).trim() };
}

export async function englishEssayPrompt(
  defaultEnglish?: string,
): Promise<EnglishEssayAnswers> {
  const answers = await inquirer.prompt([
    {
      type: "input",
      name: "english",
      message: chalk.cyan("上の日本語を英語で書いてください"),
      default:
        optionalTrim(defaultEnglish) ? defaultEnglish : undefined,
      validate: (value: unknown) => {
        if (!optionalTrim(value)) {
          return "空は不可です。";
        }
        return true;
      },
    },
  ]);

  return { english: (answers.english as string).trim() };
}

export async function retryEnglishPrompt(): Promise<{ retry: boolean }> {
  const answers = await inquirer.prompt([
    {
      type: "confirm",
      name: "retry",
      message: chalk.yellow("英作文を直して、もう一度レビューしますか？"),
      default: false,
    },
  ]);

  return { retry: Boolean(answers.retry) };
}
