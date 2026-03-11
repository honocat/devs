#!/usr/bin/env node

import { Command } from "commander";
import chalk from "chalk";

import { runMemo } from "./commands/memo.js";
import { runDiary } from "./commands/diary.js";
import { runBalance } from "./commands/balance.js";
import { runJournal } from "./commands/journal.js";

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
  .alias("j")
  .description("write morning journal")
  .action(runJournal);

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
