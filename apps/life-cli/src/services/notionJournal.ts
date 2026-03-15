import dayjs from "dayjs";
import { notion } from "./notionClient.js";
import { requireEnv } from "./env.js";
import { buildTaskProperties } from "./notionProps.js";

export type MorningJournalPayload = {
  targetY: string;
  target3M: string;
  task: string;
  smallWin: string;
  idea: string;
};

export type NightJournalPayload = {
  gratitude: string;
  insight: string;
  tomorrowTask: string;
  note?: string;
};

// TODO: LLM連携時にフィードバック生成を実装する

export async function assertNotionConnection() {
  await notion.users.me({});
}

function buildSection(question: string, answer: string): any[] {
  return [
    {
      object: "block",
      type: "heading_3",
      heading_3: {
        rich_text: [{ type: "text", text: { content: question } }],
      },
    },
    {
      object: "block",
      type: "paragraph",
      paragraph: {
        rich_text: [{ type: "text", text: { content: answer } }],
      },
    },
  ];
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
      {
        object: "block",
        type: "heading_2",
        heading_2: {
          rich_text: [
            { type: "text", text: { content: "モーニング・ジャーナル" } },
          ],
        },
      },
      ...buildSection("Q1. 1年間の目標は？", payload.targetY),
      ...buildSection("Q2. 直近3ヶ月の目標は？", payload.target3M),
      ...buildSection("Q3. 今日の最低目標は？", payload.smallWin),
      ...buildSection("Q4. 今日やり遂げたいタスクは？", payload.task),
      ...buildSection(
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

  const children: any[] = [
    {
      object: "block",
      type: "heading_2",
      heading_2: {
        rich_text: [{ type: "text", text: { content: "ナイト・ジャーナル" } }],
      },
    },
    ...buildSection("今日感謝したこと", payload.gratitude),
    ...buildSection("今日の気付き・成長", payload.insight),
    ...buildSection("明日やること", payload.tomorrowTask),
  ];

  if (payload.note && payload.note.trim().length > 0) {
    children.push(...buildSection("自由記述", payload.note.trim()));
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
