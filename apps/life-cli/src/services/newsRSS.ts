const BUSINESS_RSS_URL =
  "https://news.google.com/rss/headlines/section/topic/BUSINESS?hl=ja&gl=JP&ceid=JP:ja";

export type BusinessNewsItem = {
  title: string;
  source: string;
  snippet: string;
  link: string;
};

function extractTagContent(itemXml: string, tagName: string) {
  const cdataRegex = new RegExp(
    `<${tagName}><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tagName}>`,
  );
  const plainRegex = new RegExp(`<${tagName}>([\\s\\S]*?)<\\/${tagName}>`);
  const cdataMatch = itemXml.match(cdataRegex);
  if (cdataMatch?.[1]) {
    return cdataMatch[1].trim();
  }

  const plainMatch = itemXml.match(plainRegex);
  return plainMatch?.[1]?.trim() ?? "";
}

function stripHtml(value: string) {
  return value
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function extractSource(itemXml: string) {
  const source = extractTagContent(itemXml, "source");
  if (source.length > 0) {
    return stripHtml(source);
  }

  const description = extractTagContent(itemXml, "description");
  const sourceInDescription = description.match(
    /<font[^>]*>(.*?)<\/font>/i,
  )?.[1];

  return sourceInDescription ? stripHtml(sourceInDescription) : "不明";
}

export async function fetchBusinessNews(
  limit = 50,
): Promise<BusinessNewsItem[]> {
  const response = await fetch(BUSINESS_RSS_URL);
  if (!response.ok) {
    throw new Error(`RSS取得に失敗しました: ${response.status}`);
  }

  const xml = await response.text();
  const itemMatches = [...xml.matchAll(/<item>[\s\S]*?<\/item>/g)].map(
    (match) => match[0],
  );

  const newsItems = itemMatches
    .map((itemXml) => {
      const title = stripHtml(extractTagContent(itemXml, "title"));
      const description = stripHtml(extractTagContent(itemXml, "description"));
      const link = extractTagContent(itemXml, "link");
      const source = extractSource(itemXml);

      return {
        title,
        source,
        snippet: description,
        link,
      };
    })
    .filter(
      (item) =>
        item.title.length > 0 &&
        !item.title.includes("Google ニュース") &&
        item.link.length > 0,
    )
    .slice(0, limit);

  if (newsItems.length === 0) {
    throw new Error("ニュース抽出に失敗しました。");
  }

  return newsItems;
}

function toReadableText(html: string) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function extractMetaContent(html: string, key: string) {
  const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const byProperty = new RegExp(
    `<meta[^>]+property=["']${escaped}["'][^>]+content=["']([^"']+)["'][^>]*>`,
    "i",
  );
  const byName = new RegExp(
    `<meta[^>]+name=["']${escaped}["'][^>]+content=["']([^"']+)["'][^>]*>`,
    "i",
  );

  const match = html.match(byProperty) ?? html.match(byName);
  return match?.[1] ? toReadableText(match[1]) : "";
}

function extractTagInnerHtml(html: string, tagName: string) {
  const escaped = tagName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(
    `<${escaped}[^>]*>([\\s\\S]*?)<\\/${escaped}>`,
    "i",
  );
  const match = html.match(regex);
  return match?.[1] ?? "";
}

function pickBodyCandidate(candidates: string[]) {
  const cleaned = candidates
    .map((c) => toReadableText(c))
    .map((c) => c.replace(/\s+/g, " ").trim())
    .filter((c) => c.length > 0);

  const longEnough = cleaned.filter((c) => c.length >= 200);
  if (longEnough.length > 0) {
    return longEnough.sort((a, b) => b.length - a.length)[0]!;
  }

  return cleaned.sort((a, b) => b.length - a.length)[0] ?? "";
}

async function fetchArticleBody(link: string, timeoutMs = 8000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(link, {
      signal: controller.signal,
      redirect: "follow",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
      },
    });

    if (!response.ok) {
      return "";
    }

    const html = await response.text();
    const ogDescription = extractMetaContent(html, "og:description");
    const twitterDescription = extractMetaContent(html, "twitter:description");
    const articleInner = extractTagInnerHtml(html, "article");
    const mainInner = extractTagInnerHtml(html, "main");

    const readable = pickBodyCandidate([
      ogDescription,
      twitterDescription,
      articleInner,
      mainInner,
      html,
    ]);

    return readable.slice(0, 3500);
  } catch {
    return "";
  } finally {
    clearTimeout(timer);
  }
}

export async function enrichNewsWithBody(items: BusinessNewsItem[]) {
  const enriched = await Promise.all(
    items.map(async (item) => {
      const body = await fetchArticleBody(item.link);
      return {
        ...item,
        body: body.length > 0 ? body : item.snippet,
      };
    }),
  );

  return enriched;
}
