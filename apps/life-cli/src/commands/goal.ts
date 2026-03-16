import chalk from "chalk";
import dayjs from "dayjs";
import {
  loadLifeGoal,
  loadMonthlyGoal,
  loadYearlyGoal,
} from "../services/goalsStore.js";
import { loadTodayFocus } from "../services/todayFocusStore.js";
import { runFramedCommand } from "../utils/commandFrame.js";

export async function runGoal() {
  await runFramedCommand(async () => {
    const today = dayjs().format("YYYY-MM-DD");
    console.log(chalk.white(`📅 今日の日付: ${today}`));
    console.log();

    const [lifeGoal, yearlyGoal, monthlyGoal] = await Promise.all([
      loadLifeGoal(),
      loadYearlyGoal(),
      loadMonthlyGoal(),
    ]);

    console.log(chalk.cyan("🎯 生涯目標"));
    console.log(chalk.white(chalk.bold(lifeGoal)));
    console.log();

    console.log(chalk.cyan("🎯 年次目標"));
    console.log(chalk.white(chalk.bold(yearlyGoal)));
    console.log();

    console.log(chalk.cyan("🎯 月次目標"));
    console.log(chalk.white(chalk.bold(monthlyGoal)));
    console.log();

    const focus = await loadTodayFocus();
    const isTodayFocus = focus?.date === today;

    console.log(chalk.cyan("🎯 今日の最低目標"));
    if (isTodayFocus && focus) {
      console.log(chalk.white(chalk.bold(focus.smallWin)));
    } else {
      console.log(chalk.white(chalk.bold("未設定")));
      if (focus) {
        console.log(chalk.gray(`（最終保存日: ${focus.date}）`));
      }
    }
    console.log();

    console.log(chalk.cyan("✅ 今日やり遂げたいタスク"));
    if (isTodayFocus && focus) {
      console.log(chalk.white(`- ${focus.task}`));
    } else {
      console.log(chalk.white(chalk.bold("未設定")));
      if (focus) {
        console.log(chalk.gray(`（最終保存日: ${focus.date}）`));
      }
    }
    console.log();
  });
}
