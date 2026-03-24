import dayjs from "dayjs";
import { notion } from "./notionClient.js";
import { requireEnv } from "./env.js";
import { buildTaskProperties } from "./notionProps.js";
import type { MorningJournalPayload, NightJournalPayload } from "../types/journal.js";
import { heading2, section } from "./notionBlocks.js";

// TODO: LLM連携時にフィードバック生成を実装する

export async function assertNotionConnection() {
  await notion.users.me({});
}

export async function addMorningJournal(payload: MorningJournalPayload) {
  const dataSourceId = requireEnv(
    "DATA_SOURCE_ID",
    "NotionのデータソースIDが設定されていません（DATA_SOURCE_ID）。",
  );

  const today = dayjs().format("YYYY-MM-DD");

  await notion.pages.create({
    parent: {
      type: "data_source_id",
      data_source_id: dataSourceId,
    },
    properties: buildTaskProperties(
      `${today} モーニングジャーナル`,
      "モーニングジャーナル",
    ),
    children: [
      heading2("モーニング・ジャーナル"),
      ...section("Q1. 直近3ヶ月の目標は？", payload.target3M),
      ...section("Q2. 今日の最低目標は？", payload.smallWin),
      ...section("Q3. 今日やり遂げたいタスクは？", payload.task),
      ...section(
        "Q4. 理想の自分は、今日という日をどう過ごす？",
        payload.idea,
      ),
    ],
  });
}

export async function addNightJournal(payload: NightJournalPayload) {
  const dataSourceId = requireEnv(
    "DATA_SOURCE_ID",
    "NotionのデータソースIDが設定されていません（DATA_SOURCE_ID）。",
  );

  const today = dayjs().format("YYYY-MM-DD");

  const todaySmallWin =
    payload.todaySmallWin && payload.todaySmallWin.trim().length > 0
      ? payload.todaySmallWin.trim()
      : "未設定";
  const todayTask =
    payload.todayTask && payload.todayTask.trim().length > 0
      ? payload.todayTask.trim()
      : "未設定";

  const focusReflectionText = [
    `今日の最低目標（朝）: ${todaySmallWin}`,
    `結果: ${payload.smallWinResult}`,
    `振り返り: ${payload.smallWinReflection}`,
    "",
    `今日やり遂げたいタスク（朝）: ${todayTask}`,
    `結果: ${payload.taskResult}`,
    `振り返り: ${payload.taskReflection}`,
  ].join("\n");

  const children: any[] = [
    heading2("ナイト・ジャーナル"),
    ...section(`${payload.tenYearsLaterLabel}どうなっていたいか`, payload.tenYearVision),
    ...section("そのためにこの1年何を目標にするか", payload.oneYearGoal),
    ...section("今日感謝したこと", payload.gratitude),
    ...section("今日の気付き・成長", payload.insight),
    ...section("今日の最低目標・やるべきタスクの振り返り", focusReflectionText),
    ...section("明日やること", payload.tomorrowTask),
  ];

  await notion.pages.create({
    parent: {
      type: "data_source_id",
      data_source_id: dataSourceId,
    },
    properties: buildTaskProperties(
      `${today} ナイトジャーナル`,
      "ナイトジャーナル",
    ),
    children,
  });
}
