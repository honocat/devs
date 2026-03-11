import { notion } from "./notionClient.js";

export async function addBalance(item: string, amount: number) {
  await notion.pages.create({
    parent: {
      type: "data_source_id",
      data_source_id: process.env.DATA_SOURCE_ID_BALANCE!,
    },

    properties: {
      品目: {
        title: [
          {
            text: { content: item },
          },
        ],
      },

      金額: {
        number: amount,
      },

      作成日時: {
        date: {
          start: new Date().toISOString(),
        },
      },
    },
  });
}
