#!/usr/bin/env node

import chalk from "chalk";
import { Command } from "commander";
import { runBalance } from "./commands/balance.js";
import { runDiary } from "./commands/diary.js";
import { runEnglish } from "./commands/english.js";
import { runGoal } from "./commands/goal.js";
import { runMorningJournal } from "./commands/morningJournal.js";
import { runMemo } from "./commands/memo.js";
import { runNews } from "./commands/news.js";
import { runNightJournal } from "./commands/nightJournal.js";

type CommandAction = () => Promise<void>;

type CommandDefinition = {
  name: string;
  description: string;
  action: CommandAction;
  alias?: string;
};

const commandDefinitions: CommandDefinition[] = [
  { name: "memo", alias: "m", description: "add memo", action: runMemo },
  { name: "diary", alias: "d", description: "write diary", action: runDiary },
  {
    name: "english",
    alias: "en",
    description: "write JP->EN and get Gemini review",
    action: runEnglish,
  },
  {
    name: "balance",
    alias: "b",
    description: "add balance",
    action: runBalance,
  },
  { name: "goal", alias: "g", description: "show goals", action: runGoal },
  {
    name: "morning-journal",
    alias: "mj",
    description: "write morning journal",
    action: runMorningJournal,
  },
  {
    name: "night-journal",
    alias: "nj",
    description: "write night journal",
    action: runNightJournal,
  },
  {
    name: "news",
    alias: "n",
    description: "collect and analyze daily news",
    action: runNews,
  },
];

const program = new Command();

program.name("life").description("life logging cli");

for (const commandDefinition of commandDefinitions) {
  const command = program
    .command(commandDefinition.name)
    .description(commandDefinition.description)
    .action(commandDefinition.action);

  if (commandDefinition.alias) {
    command.alias(commandDefinition.alias);
  }
}

program.parseAsync().catch((error: unknown) => {
  const isPromptCancel =
    typeof error === "object" &&
    error !== null &&
    "name" in error &&
    (error as { name: string }).name === "ExitPromptError";

  if (isPromptCancel) {
    console.log();
    console.log(chalk.yellow("⚠ 入力をキャンセルしました"));
    console.log(chalk.gray("────────────────"));
    process.exit(0);
  }

  throw error;
});
