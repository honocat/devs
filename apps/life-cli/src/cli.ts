#!/usr/bin/env node

import { Command } from "commander";

import { runMemo } from "./commands/memo.js";
import { runDiary } from "./commands/diary.js";
import { runBalance } from "./commands/balance.js";

const program = new Command();

program.name("life").description("life logging cli");

program.command("memo").alias("m").description("add memo").action(runMemo);

program.command("diary").alias("d").description("write diary").action(runDiary);

program
  .command("balance")
  .alias("b")
  .description("add balance")
  .action(runBalance);

program.parse();
