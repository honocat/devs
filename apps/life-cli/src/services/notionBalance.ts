import { notion } from "./notionClient.js";
import { requireEnv } from "./env.js";
import { buildBalanceProperties } from "./notionProps.js";

export async function addBalance(item: string, amount: number) {
  const dataSourceId = requireEnv(
    "DATA_SOURCE_ID_BALANCE",
    "家計簿用NotionデータソースIDが未設定です（DATA_SOURCE_ID_BALANCE）。",
  );

  await notion.pages.create({
    parent: {
      type: "data_source_id",
      data_source_id: dataSourceId,
    },
    properties: buildBalanceProperties(item, amount),
  });
}
