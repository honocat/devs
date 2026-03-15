import dayjs from "dayjs";
import { notion } from "./notionClient.js";
import { requireOneOfEnv } from "./env.js";

type PastNews = {
  title: string;
  summary: string;
};

export type AnalyzedNews = {
  title: string;
  summary: string;
  source: string;
  detail: string;
  trend_context: string;
  future_outlook: string;
  insight: string[];
};

function getNewsDataSourceIdOrThrow() {
  return requireOneOfEnv(
    ["DATA_SOURCE_ID_NEWS", "DATA_SOURCE_ID"],
    "ニュース用NotionデータソースIDが未設定です（DATA_SOURCE_ID_NEWS または DATA_SOURCE_ID）。",
  ).value;
}

export async function fetchPastMonthNews(): Promise<PastNews[]> {
  const dataSourceId = getNewsDataSourceIdOrThrow();
  const from = dayjs().subtract(30, "day").toISOString();

  const result = await notion.dataSources.query({
    data_source_id: dataSourceId,
    filter: {
      property: "作成日時",
      date: {
        on_or_after: from,
      },
    },
    page_size: 100,
  });

  return result.results.map((page) => {
    if (!("properties" in page)) {
      return { title: "", summary: "" };
    }

    const title = page.properties["タイトル"];
    const summary = page.properties["要約"];

    return {
      title:
        title?.type === "title" &&
        Array.isArray(title.title) &&
        title.title[0]?.plain_text
          ? title.title[0].plain_text
          : "",
      summary:
        summary?.type === "rich_text" &&
        Array.isArray(summary.rich_text) &&
        summary.rich_text[0]?.plain_text
          ? summary.rich_text[0].plain_text
          : "",
    };
  });
}

export async function saveAnalyzedNewsItems(items: AnalyzedNews[]) {
  const dataSourceId = getNewsDataSourceIdOrThrow();

  for (const item of items) {
    const created = await notion.pages.create({
      parent: {
        type: "data_source_id",
        data_source_id: dataSourceId,
      },
      properties: {
        タイトル: {
          title: [{ text: { content: item.title } }],
        },
        要約: {
          rich_text: [{ text: { content: item.summary } }],
        },
        ソース: {
          rich_text: [{ text: { content: item.source } }],
        },
        ジャンル: {
          multi_select: [],
        },
        作成日時: {
          date: { start: new Date().toISOString() },
        },
      },
    });

    await notion.blocks.children.append({
      block_id: created.id,
      children: [
        {
          object: "block",
          type: "heading_2",
          heading_2: {
            rich_text: [{ type: "text", text: { content: "📰ニュース詳細" } }],
          },
        },
        {
          object: "block",
          type: "paragraph",
          paragraph: {
            rich_text: [{ type: "text", text: { content: item.detail } }],
          },
        },
        {
          object: "block",
          type: "heading_2",
          heading_2: {
            rich_text: [
              { type: "text", text: { content: "📈ニュースの流れ" } },
            ],
          },
        },
        {
          object: "block",
          type: "paragraph",
          paragraph: {
            rich_text: [
              { type: "text", text: { content: item.trend_context } },
            ],
          },
        },
        {
          object: "block",
          type: "heading_2",
          heading_2: {
            rich_text: [{ type: "text", text: { content: "🔮今後の展望" } }],
          },
        },
        {
          object: "block",
          type: "paragraph",
          paragraph: {
            rich_text: [
              { type: "text", text: { content: item.future_outlook } },
            ],
          },
        },
        {
          object: "block",
          type: "heading_2",
          heading_2: {
            rich_text: [
              { type: "text", text: { content: "💡ビジネス的示唆" } },
            ],
          },
        },
        ...item.insight.map((line) => ({
          object: "block" as const,
          type: "bulleted_list_item" as const,
          bulleted_list_item: {
            rich_text: [{ type: "text" as const, text: { content: line } }],
          },
        })),
      ],
    });
  }
}
