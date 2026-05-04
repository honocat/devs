import { notion, requireEnv } from "./notionClient.js";

import { Title, Text } from "../utils/notionProperties.js";

export async function addWord(name: string) {
  const dataSourceId = requireEnv("DATA_SOURCE_ID_WORDS");
  await notion.pages.create({
    parent: {
      type: "data_source_id",
      data_source_id: dataSourceId,
    },
    properties: {
      名前: Title(name),
      意味: Text(""),
      // ジャンル: MultiSelect(""),
      備考: Text(""),
    },
  });
}
