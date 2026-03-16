import { notion } from "./notionClient.js";
import { requireEnv } from "./env.js";
import { buildTaskProperties } from "./notionProps.js";

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

  const CHUNK_SIZE = 50;
  for (let i = 0; i < children.length; i += CHUNK_SIZE) {
    await notion.blocks.children.append({
      block_id: created.id,
      children: children.slice(i, i + CHUNK_SIZE),
    });
  }
}
