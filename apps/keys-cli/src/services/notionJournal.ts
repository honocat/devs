import { notion, requireEnv } from "./notionClient.js";
import {
  type MorningJournalAnswers,
  type NightJournalAnswers,
} from "../prompts/journalPrompt.js";
import {
  bulletedList,
  heading2,
  paragraph,
  section,
} from "./notionChildren.js";

export async function addMorningJournal(
  answers: MorningJournalAnswers,
  currentGoal: string,
  tenYearVision: string,
  currentYearlyGoal: string,
  currentMonthlyGoal: string,
) {
  const dataSourceId = requireEnv("DATA_SOURCE_ID");
  const today = new Date().toLocaleDateString();

  await notion.pages.create({
    parent: {
      type: "data_source_id",
      data_source_id: dataSourceId,
    },
    properties: {
      名前: { title: [{ text: { content: `${today} モーニングジャーナル` } }] },
      タグ: { multi_select: [{ name: "モーニングジャーナル" }] },
      作成日時: { date: { start: new Date().toISOString() } },
      ステータス: { status: { name: "完了" } },
    },
    children: [
      heading2("モーニング・ジャーナル"),
      bulletedList(`Mission: ${currentGoal}`),
      bulletedList(`Vision: ${tenYearVision}`),
      bulletedList(`Yearly Goal: ${currentYearlyGoal}`),
      bulletedList(`Monthly Goal: ${currentMonthlyGoal}`),
      paragraph(""),
      section("直近3か月の目標は？", answers.target3M),
      section("今日の最低目標は？", answers.smallWin),
      section("今日やり遂げたいタスクは？", answers.task),
      section("理想の自分は、今日という日をどう過ごす？？", answers.idea),
    ],
  });
}

export async function addNightJournal(
  answers: NightJournalAnswers,
  currentGoal: string,
  currentMonthlyGoal: string,
  tenYearsLaterLabel: number,
) {
  const dataSourceId = requireEnv("DATA_SOURCE_ID");
  const today = new Date().toLocaleDateString();

  await notion.pages.create({
    parent: {
      type: "data_source_id",
      data_source_id: dataSourceId,
    },
    properties: {
      名前: { title: [{ text: { content: `${today} ナイトジャーナル` } }] },
      タグ: { multi_select: [{ name: "ナイトジャーナル" }] },
      作成日時: { date: { start: new Date().toISOString() } },
      ステータス: { status: { name: "完了" } },
    },
    children: [
      heading2("ナイト・ジャーナル"),
      bulletedList(`Mission: ${currentGoal}`),
      bulletedList(`Vision: ${answers.tenYearVision}`),
      bulletedList(`Yearly Goal: ${answers.yearlyGoal}`),
      bulletedList(`Monthly Goal: ${currentMonthlyGoal}`),
      paragraph(""),
      section(
        `10年後（${tenYearsLaterLabel}歳）どうなっていたいか`,
        answers.tenYearVision,
      ),
      section("そのためにこの1年何を目標にするか", answers.yearlyGoal),
      section("今日感謝したことはなにか", answers.gratitude),
      section("今日の気づき・成長はなにか", answers.insight),
      section(
        "今日のタスクの振り返り",
        answers.todayTaskRefrection && answers.todayTaskResult
          ? `${answers.todayTaskResult}: ${answers.todayTaskRefrection}`
          : "タスク未設定",
      ),
      section("明日やり遂げたいタスクは？", answers.tomorrowTask),
      answers.freeWriting
        ? section("自由記述", answers.freeWriting)
        : paragraph(""),
    ],
  });
}
