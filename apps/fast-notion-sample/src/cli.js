#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chalk_1 = require("chalk");
var commander_1 = require("commander");
var memo_js_1 = require("./commands/memo.js");
var program = new commander_1.Command();
program.name("sample-cli");
program.command("memo").alias("m").description("add memo").action(memo_js_1.runMemo);
program.parseAsync().catch(function (error) {
    var isPromptCancel = typeof error === "object" &&
        error !== null &&
        "name" in error &&
        error.name === "ExitPromptError";
    if (isPromptCancel) {
        console.log();
        console.log(chalk_1.default.yellow("入力をキャンセルしました"));
        process.exit(0);
    }
    throw error;
});
