import { notion, requiredEnv } from "./notionClient.js";

export async function addMemo(title: string) {
  await notion.pages.create({
    parent: {
      type: "data_source_id",
      data_source_id: requiredEnv("DATA_SOURCE_ID"),
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
        multi_select: [{ name: "メモ" }],
      },
    },
  });
}
