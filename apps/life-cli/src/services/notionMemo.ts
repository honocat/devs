import { notion } from "./notionClient.js";
import { requireEnv } from "./env.js";
import { buildTaskProperties } from "./notionProps.js";

export async function addMemo(title: string, tag: string) {
  const dataSourceId = requireEnv(
    "DATA_SOURCE_ID",
    "NotionのデータソースIDが設定されていません（DATA_SOURCE_ID）。",
  );

  await notion.pages.create({
    parent: {
      type: "data_source_id",
      data_source_id: dataSourceId,
    },
    properties: buildTaskProperties(title, tag),
  });
}
