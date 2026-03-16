import { notion } from "./notionClient.js";
import { requireEnv } from "./env.js";

export async function addWord(name: string) {
  const dataSourceId = requireEnv(
    "DATA_SOURCE_ID_WORDS",
    "語句DB用NotionデータソースIDが未設定です（DATA_SOURCE_ID_WORDS）。",
  );

  await notion.pages.create({
    parent: {
      type: "data_source_id",
      data_source_id: dataSourceId,
    },
    properties: {
      名前: {
        title: [{ text: { content: name } }],
      },
      意味: {
        rich_text: [],
      },
      ジャンル: {
        multi_select: [],
      },
      備考: {
        rich_text: [],
      },
    },
  });
}

