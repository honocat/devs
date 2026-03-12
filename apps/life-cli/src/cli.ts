#!/usr/bin/env node

import { Command } from "commander";
import chalk from "chalk";

import { runMemo } from "./commands/memo.js";
import { runDiary } from "./commands/diary.js";
import { runBalance } from "./commands/balance.js";
import { runJournal, runMorningJournal } from "./commands/journal.js";
import { runNightJournal } from "./commands/nightJournal.js";
import { runNews } from "./commands/news.js";

const program = new Command();

program.name("life").description("life logging cli");

program.command("memo").alias("m").description("add memo").action(runMemo);

program.command("diary").alias("d").description("write diary").action(runDiary);

program
  .command("balance")
  .alias("b")
  .description("add balance")
  .action(runBalance);

program
  .command("journal")
  .description("write morning journal (legacy command)")
  .action(runJournal);

program
  .command("morning-journal")
  .alias("mj")
  .description("write morning journal")
  .action(runMorningJournal);

program
  .command("night-journal")
  .alias("nj")
  .description("write night journal")
  .action(runNightJournal);

program
  .command("news")
  .alias("n")
  .description("collect and analyze daily news")
  .action(runNews);

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
