#!/usr/bin/env node

import chalk from "chalk";
import { Command } from "commander";
import { runMemo } from "./commands/memo.js";

const program = new Command();

program.name("sample-cli");

program
  .command("memo")
  .alias("m")
  .description("add memo")
  .action(runMemo);

program.parseAsync().catch((error: unknown) => {
  const isPromptCancel =
    typeof error === "object" &&
    error !== null &&
    "name" in error &&
    (error as { name: string }).name === "ExitPromptError";
  if (isPromptCancel) {
    console.log();
    console.log(chalk.yellow("入力をキャンセルしました"));
    process.exit(0);
  }
  throw error;
});
