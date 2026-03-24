import { notion } from "./notionClient.js";
import { requireEnv } from "./env.js";
import { buildTaskProperties } from "./notionProps.js";
import { appendChildrenInChunks } from "./notionAppend.js";

export async function addMemo(title: string, tag: string, children?: any[]) {
  const dataSourceId = requireEnv(
    "DATA_SOURCE_ID",
    "NotionのデータソースIDが設定されていません（DATA_SOURCE_ID）。",
  );

  const created = await notion.pages.create({
    parent: {
      type: "data_source_id",
      data_source_id: dataSourceId,
    },
    properties: buildTaskProperties(title, tag),
  });

  if (!Array.isArray(children) || children.length === 0) {
    return;
  }

  await appendChildrenInChunks({ blockId: created.id, children });
}
