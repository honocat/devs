import { notion } from "./notionClient.js";

export async function addMemo(title: string, tag: string) {
  await notion.pages.create({
    parent: {
      type: "data_source_id",
      data_source_id: process.env.DATA_SOURCE_ID!,
    },

    properties: {
      名前: {
        title: [
          {
            text: { content: title },
          },
        ],
      },

      タグ: {
        multi_select: [{ name: tag }],
      },

      作成日時: {
        date: { start: new Date().toISOString() },
      },

      ステータス: {
        status: { name: "未着手" },
      },
    },
  });
}
