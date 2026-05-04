#!/usr/bin/env node

import chalk from "chalk";
import { Command } from "commander";
import { runMemo } from "./commands/memo.js";
import { runMorningJournal, runNightJournal } from "./commands/journal.js";
import { runWord } from "./commands/word.js";

const program = new Command();

program.name("key's life logging cli");

// memo
program
  .command("memo")
  .alias("m")
  .description("add memo to Notion DB.")
  .action(runMemo);

// morning journal
program
  .command("morning-journal")
  .alias("mj")
  .description("write morning journal & add to Notion DB.")
  .action(runMorningJournal);
// night journal
program
  .command("night-journal")
  .alias("nj")
  .description("write night journal & add to Notion DB.")
  .action(runNightJournal);

// word
program
  .command("word")
  .alias("w")
  .description("add page to Notion `Words` DB.")
  .action(runWord);
// word, goal,

program.parseAsync().catch((error: unknown) => {
  const isPromptCancel =
    typeof error === "object" &&
    error !== null &&
    "name" in error &&
    (error as { name: string }).name === "ExitPromptError";
  if (isPromptCancel) {
    console.log();
    console.log(chalk.yellow("⚠ 入力をキャンセルしました"));
    process.exit(0);
  }
  throw error;
});
