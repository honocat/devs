import { notion, requireEnv } from "./notionClient.js";

export async function addMemo(title: string) {
  await notion.pages.create({
    parent: {
      type: "data_source_id",
      data_source_id: requireEnv("DATA_SOURCE_ID"),
    },
    properties: {
      名前: { title: [{ text: { content: title } }] },
      タグ: { multi_select: [{ name: "タスク" }] },
      作成日時: { date: { start: new Date().toISOString() } },
      ステータス: { status: { name: "未着手" } },
    },
  });
}
