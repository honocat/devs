import chalk from "chalk";
import dayjs from "dayjs";
import {
  goalUpdatePrompt,
  morningJournalPrompt,
} from "../prompts/journalPrompt.js";
import {
  loadLifeGoal,
  saveLifeGoal,
  loadYearlyGoal,
  saveYearlyGoal,
  loadMonthlyGoal,
  saveMonthlyGoal,
} from "../services/goalsStore.js";
import { loadLastTask } from "../services/lastTaskStore.js";
import {
  addMorningJournal,
  assertNotionConnection,
} from "../services/notionJournal.js";
import { runFramedCommand } from "../utils/commandFrame.js";
import { runNews } from "./news.js";

export async function runMorningJournal() {
  await runFramedCommand(async () => {
    console.log(chalk.white(`📅 今日の日付: ${dayjs().format("YYYY-MM-DD")}`));

    await assertNotionConnection();
    console.log(chalk.green("✔ Notion接続OK"));

    const currentGoal = await loadLifeGoal();
    console.log(chalk.cyan("🎯 生涯目標"));
    console.log(chalk.white(chalk.bold(currentGoal)));
    console.log();

    const currentYearlyGoal = await loadYearlyGoal();
    console.log(chalk.cyan("🎯 年次目標"));
    console.log(chalk.white(chalk.bold(currentYearlyGoal)));
    console.log();

    const currentMonthlyGoal = await loadMonthlyGoal();
    console.log(chalk.cyan("🎯 月次目標"));
    console.log(chalk.white(chalk.bold(currentMonthlyGoal)));
    console.log();

    const lastTask = await loadLastTask();
    if (lastTask) {
      console.log(chalk.cyan("\n🌙 昨夜の予定"));
      console.log(chalk.white(`- ${lastTask.tomorrowTask}`));
      console.log();
    }

    const answers = await morningJournalPrompt();
    await saveYearlyGoal(answers.targetY);
    await saveMonthlyGoal(answers.target3M);
    await addMorningJournal(answers);
    console.log(chalk.green("✔ morning journal added"));

    const nextGoal = await goalUpdatePrompt(currentGoal);
    if (typeof nextGoal === "string" && nextGoal.trim().length > 0) {
      await saveLifeGoal(nextGoal.trim());
      console.log(chalk.green("✔ 生涯目標を更新しました"));
    }
  });

  console.log(
    chalk.cyan(
      "\n✔ モーニングジャーナル完了。続けてニュース分析を開始します...",
    ),
  );
  await runNews();
}
