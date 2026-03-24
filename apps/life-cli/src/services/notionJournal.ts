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
      ...section("Q1. 1年間の目標は？", payload.targetY),
      ...section("Q2. 直近3ヶ月の目標は？", payload.target3M),
      ...section("Q3. 今日の最低目標は？", payload.smallWin),
      ...section("Q4. 今日やり遂げたいタスクは？", payload.task),
      ...section(
        "Q5. 理想の自分は、今日という日をどう過ごす？",
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
    `達成状況: ${payload.smallWinStatus}`,
    `今日やり遂げたいタスク（朝）: ${todayTask}`,
    `達成状況: ${payload.taskStatus}`,
  ].join("\n");

  const children: any[] = [
    heading2("ナイト・ジャーナル"),
    ...section("今日のフォーカス振り返り", focusReflectionText),
    ...section("今日感謝したこと", payload.gratitude),
    ...section("今日の気付き・成長", payload.insight),
    ...section("明日やること", payload.tomorrowTask),
  ];

  if (payload.note && payload.note.trim().length > 0) {
    children.push(...section("自由記述", payload.note.trim()));
  }

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
