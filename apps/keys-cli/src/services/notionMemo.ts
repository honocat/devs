import { notion, requireEnv } from "./notionClient.js";

import {
  Title,
  MultiSelect,
  DateProp,
  Status,
} from "../utils/notionProperties.js";

export async function addMemo(title: string) {
  const dataSourceId = requireEnv("DATA_SOURCE_ID");
  await notion.pages.create({
    parent: {
      type: "data_source_id",
      data_source_id: dataSourceId,
    },
    properties: {
      名前: Title(title),
      タグ: MultiSelect("タスク"),
      作成日時: DateProp(new Date().toISOString()),
      ステータス: Status("未着手"),
    },
  });
}
