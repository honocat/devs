import chalk from "chalk";
import dayjs from "dayjs";
import { nightJournalPrompt } from "../prompts/nightJournalPrompt.js";
import { saveLastTask } from "../services/lastTaskStore.js";
import {
  addNightJournal,
  assertNotionConnection,
} from "../services/notionJournal.js";
import { runFramedCommand } from "../utils/commandFrame.js";

export async function runNightJournal() {
  await runFramedCommand(async () => {
    console.log(chalk.white(`🌙 今日の日付: ${dayjs().format("YYYY-MM-DD")}`));

    await assertNotionConnection();
    console.log(chalk.green("✔ Notion接続OK"));

    const answers = await nightJournalPrompt();
    await saveLastTask(answers.tomorrowTask);
    await addNightJournal(answers);
    console.log(chalk.green("✔ night journal added"));
  });
}
