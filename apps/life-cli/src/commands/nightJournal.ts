import chalk from "chalk";
import dayjs from "dayjs";
import { nightJournalPrompt } from "../prompts/nightJournalPrompt.js";
import { saveLastTask } from "../services/lastTaskStore.js";
import {
  addNightJournal,
  assertNotionConnection,
} from "../services/notionJournal.js";
import { loadTodayFocus, saveTodayFocus } from "../services/todayFocusStore.js";
import { runFramedCommand } from "../utils/commandFrame.js";

export async function runNightJournal() {
  await runFramedCommand(async () => {
    const today = dayjs().format("YYYY-MM-DD");
    console.log(chalk.white(`🌙 今日の日付: ${today}`));

    await assertNotionConnection();
    console.log(chalk.green("✔ Notion接続OK"));

    const focus = await loadTodayFocus();
    const isTodayFocus = focus?.date === today;

    console.log(chalk.cyan("\n🎯 今日のフォーカス（朝に入力した内容）"));
    if (isTodayFocus && focus) {
      console.log(chalk.white(chalk.bold("最低目標")));
      console.log(chalk.white(`- ${focus.smallWin}`));
      console.log(chalk.white(chalk.bold("やり遂げたいタスク")));
      console.log(chalk.white(`- ${focus.task}`));
    } else {
      console.log(chalk.white(chalk.bold("未設定")));
      if (focus) {
        console.log(chalk.gray(`（最終保存日: ${focus.date}）`));
      }
    }
    console.log();

    const answers = await nightJournalPrompt({
      today,
      focus: isTodayFocus ? focus : null,
    });

    const shouldSaveTodayFocus =
      !isTodayFocus &&
      typeof answers.todaySmallWin === "string" &&
      answers.todaySmallWin.trim().length > 0 &&
      typeof answers.todayTask === "string" &&
      answers.todayTask.trim().length > 0;

    if (shouldSaveTodayFocus) {
      await saveTodayFocus({
        date: today,
        smallWin: answers.todaySmallWin!,
        task: answers.todayTask!,
      });
      console.log(chalk.green("✔ 今日のフォーカスを保存しました"));
    }

    await saveLastTask(answers.tomorrowTask);
    await addNightJournal(answers);
    console.log(chalk.green("✔ night journal added"));
  });
}
