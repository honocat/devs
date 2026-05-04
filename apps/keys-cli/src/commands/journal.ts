import chalk from "chalk";
import dayjs from "dayjs";

import { assertNotionConnection } from "../services/notionClient.js";
import {
  loadLifeGoal,
  saveLifeGoal,
  loadYearlyGoal,
  saveYearlyGoal,
  loadMonthlyGoal,
  saveMonthlyGoal,
} from "../services/goals.js";
import { loadTenYearVision, saveTenYearVision } from "../services/vision.js";
import { loadTodayTask, saveTomorrowTask } from "../services/task.js";
import {
  goalUpdatePrompt,
  morningJournalPropmt,
  nightJournalPrompt,
} from "../prompts/journalPrompt.js";
import { loadTodayFocus, saveTodayFocus } from "../services/todayFocus.js";
import {
  addMorningJournal,
  addNightJournal,
} from "../services/notionJournal.js";

import { spinner } from "../utils/spinner.js";
import { calculateAgeInYears } from "../utils/age.js";

export async function runMorningJournal() {
  const today = dayjs().format("YYYY-MM-DD");
  console.log(chalk.white(` ${today}`));

  await spinner(
    "Notionへ接続中。しばらくお待ちください...",
    async () => {
      await assertNotionConnection();
    },
    1000,
  );

  let currentGoal = "";
  let tenYearVision = "";
  let currentYearlyGoal = "";
  let currentMonthlyGoal = "";
  let task = "";

  await spinner(
    "現在のゴールを取得しています...",
    async () => {
      currentGoal = await loadLifeGoal();
      tenYearVision = await loadTenYearVision();
      currentYearlyGoal = await loadYearlyGoal();
      currentMonthlyGoal = await loadMonthlyGoal();
      task = await loadTodayTask();
    },
    1000,
  );

  console.log(chalk.cyan("", chalk.bold("生涯目標")));
  console.log(chalk.white(chalk.bold(currentGoal)));
  console.log();

  console.log(chalk.cyan("", chalk.bold("10年後"), "のなりたい姿"));
  console.log(chalk.white(chalk.bold(tenYearVision)));
  console.log();

  console.log(
    chalk.cyan(" この", chalk.bold("1年"), "の目標（Night Journalより）"),
  );
  console.log(chalk.white(chalk.bold(currentYearlyGoal)));
  console.log();

  console.log(chalk.cyan(" 直近", chalk.bold("3ヶ月"), "の目標"));
  console.log(chalk.white(chalk.bold(currentMonthlyGoal)));
  console.log();

  console.log(chalk.cyan("󰖔 今日やること（Night Journalより）"));
  console.log(chalk.white(`- ${task}`));
  console.log();

  const answers = await morningJournalPropmt();

  await saveMonthlyGoal(answers.target3M);
  await saveTodayFocus({
    date: today,
    smallWin: answers.smallWin,
    task: answers.task,
  });

  await spinner("お待ちください...", async () => {
    await addMorningJournal(
      answers,
      currentGoal,
      tenYearVision,
      currentYearlyGoal,
      currentMonthlyGoal,
    );
  });

  const nextGoal = await goalUpdatePrompt(currentGoal);
  if (typeof nextGoal === "string" && nextGoal.trim().length > 0) {
    await spinner("生涯目標を更新しています...", async () => {
      await saveLifeGoal(nextGoal.trim());
    });
  }
}

const USER_BIRTH_DATE = "2001-10-11";

export async function runNightJournal() {
  const today = dayjs().format("YYYY-MM-DD");
  console.log(chalk.white(` ${today}`));

  await spinner(
    "Notionへ接続しています。しばらくお待ちください...",
    async () => {
      await assertNotionConnection();
    },
    1000,
  );

  let currentGoal = "";
  let tenYearVision = "";
  let currentYearlyGoal = "";
  let currentMonthlyGoal = "";

  await spinner(
    "現在のゴールを取得しています...",
    async () => {
      currentGoal = await loadLifeGoal();
      tenYearVision = await loadTenYearVision();
      currentYearlyGoal = await loadYearlyGoal();
      currentMonthlyGoal = await loadMonthlyGoal();
    },
    1000,
  );

  console.log(chalk.cyan("", chalk.bold("生涯目標")));
  console.log(chalk.white(chalk.bold(currentGoal)));
  console.log();

  console.log(chalk.cyan("", chalk.bold("10年後"), "のなりたい姿"));
  console.log(chalk.white(chalk.bold(tenYearVision)));
  console.log();

  console.log(
    chalk.cyan(" この", chalk.bold("1年"), "の目標（Night Journalより）"),
  );
  console.log(chalk.white(chalk.bold(currentYearlyGoal)));
  console.log();

  console.log(chalk.cyan(" 直近", chalk.bold("3ヶ月"), "の目標"));
  console.log(chalk.white(chalk.bold(currentMonthlyGoal)));
  console.log();

  await spinner(
    "今日の最低目標とタスクを取得しています...",
    async () => {},
    1000,
  );
  const focus = await loadTodayFocus();

  const isTodayFocus = focus?.date === today;

  console.log(chalk.cyan(" 今日やること（朝に入力した内容）"));
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

  const tenYearsLaterLabel =
    calculateAgeInYears({
      birthDate: USER_BIRTH_DATE,
      today,
    }) + 10;
  const answers = await nightJournalPrompt({
    today,
    focus: isTodayFocus ? focus : null,
    tenYearsLaterLabel: `10年後（${tenYearsLaterLabel}歳）`,
  });

  await saveTenYearVision(answers.tenYearVision);
  await saveYearlyGoal(answers.yearlyGoal);
  await saveTomorrowTask(answers.tomorrowTask);

  await spinner("お待ちください...", async () => {
    await addNightJournal(
      answers,
      currentGoal,
      currentMonthlyGoal,
      tenYearsLaterLabel,
    );
  });
}
