import dayjs from "dayjs";
import { notion } from "./notionClient.js";

type JournalPayload = {
  targetY: string;
  target3M: string;
  task: string;
  smallWin: string;
  idea: string;
};

const getJournalDataSourceId = () => process.env.DATA_SOURCE_ID;

export async function assertNotionConnection() {
  await notion.users.me({});
}

export async function addJournal(payload: JournalPayload) {
  const dataSourceId = getJournalDataSourceId();

  if (!dataSourceId) {
    throw new Error(
      "NotionのデータソースIDが設定されていません（DATA_SOURCE_ID）。",
    );
  }

  const today = dayjs().format("YYYY-MM-DD");

  await notion.pages.create({
    parent: {
      type: "data_source_id",
      data_source_id: dataSourceId,
    },
    properties: {
      名前: {
        title: [
          {
            text: { content: today },
          },
        ],
      },
      タグ: {
        multi_select: [{ name: "ジャーナル" }],
      },
      作成日時: {
        date: { start: new Date().toISOString() },
      },
      ステータス: {
        status: { name: "未着手" },
      },
    },
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
      {
        object: "block",
        type: "heading_3",
        heading_3: {
          rich_text: [
            { type: "text", text: { content: "Q1. 1年間の目標は？" } },
          ],
        },
      },
      {
        object: "block",
        type: "paragraph",
        paragraph: {
          rich_text: [
            {
              type: "text",
              text: { content: `${payload.targetY}` },
            },
          ],
        },
      },
      {
        object: "block",
        type: "heading_3",
        heading_3: {
          rich_text: [
            { type: "text", text: { content: "Q2. 直近3ヶ月の目標は？" } },
          ],
        },
      },
      {
        object: "block",
        type: "paragraph",
        paragraph: {
          rich_text: [
            {
              type: "text",
              text: { content: `${payload.target3M}` },
            },
          ],
        },
      },
      {
        object: "block",
        type: "heading_3",
        heading_3: {
          rich_text: [
            { type: "text", text: { content: "Q3. 今日の最低目標は？" } },
          ],
        },
      },
      {
        object: "block",
        type: "paragraph",
        paragraph: {
          rich_text: [
            {
              type: "text",
              text: { content: `${payload.smallWin}` },
            },
          ],
        },
      },
      {
        object: "block",
        type: "heading_3",
        heading_3: {
          rich_text: [
            {
              type: "text",
              text: { content: "Q4. 今日やり遂げたいタスクは？" },
            },
          ],
        },
      },
      {
        object: "block",
        type: "paragraph",
        paragraph: {
          rich_text: [
            {
              type: "text",
              text: { content: `${payload.task}` },
            },
          ],
        },
      },
      {
        object: "block",
        type: "heading_3",
        heading_3: {
          rich_text: [
            {
              type: "text",
              text: { content: "Q5. 理想の自分は、今日という日をどう過ごす？" },
            },
          ],
        },
      },
      {
        object: "block",
        type: "paragraph",
        paragraph: {
          rich_text: [
            {
              type: "text",
              text: { content: `${payload.idea}` },
            },
          ],
        },
      },
    ],
  });
}
