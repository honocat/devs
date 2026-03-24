import dayjs from "dayjs";
import { notion } from "./notionClient.js";
import { requireOneOfEnv } from "./env.js";
import { appendChildrenInChunks } from "./notionAppend.js";
import {
  bulletsFromLines,
  heading2,
  paragraph,
  paragraphsFromLongText,
} from "./notionBlocks.js";

type PastNews = {
  title: string;
  summary: string;
};

export type AnalyzedNews = {
  title: string;
  summary: string;
  source: string;
  link: string;
  body: string;
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

    await appendChildrenInChunks({
      blockId: created.id,
      children: [
        heading2("📰ニュース詳細"),
        paragraph(item.detail),
        heading2("📈ニュースの流れ"),
        paragraph(item.trend_context),
        heading2("🔮今後の展望"),
        paragraph(item.future_outlook),
        heading2("💡ビジネス的示唆"),
        ...bulletsFromLines(item.insight),
        heading2("🔗リンク"),
        paragraph(item.link),
        heading2("🧾取得本文（先頭）"),
        ...paragraphsFromLongText(item.body.slice(0, 3500)),
      ],
    });
  }
}
