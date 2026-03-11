const BUSINESS_RSS_URL =
  "https://news.google.com/rss/headlines/section/topic/BUSINESS?hl=ja&gl=JP&ceid=JP:ja";

export async function fetchBusinessNewsTitles(limit = 50) {
  const response = await fetch(BUSINESS_RSS_URL);
  if (!response.ok) {
    throw new Error(`RSS取得に失敗しました: ${response.status}`);
  }

  const xml = await response.text();
  const itemMatches = [...xml.matchAll(/<item>[\s\S]*?<\/item>/g)].map(
    (match) => match[0],
  );
  const titles = itemMatches
    .map((item) => {
      const titleMatch = item.match(
        /<title><!\[CDATA\[(.*?)\]\]><\/title>|<title>(.*?)<\/title>/,
      );
      return (titleMatch?.[1] ?? titleMatch?.[2] ?? "").trim();
    })
    .filter((title) => title.length > 0 && !title.includes("Google ニュース"))
    .slice(0, limit);

  if (titles.length === 0) {
    throw new Error("ニュース抽出に失敗しました。");
  }

  return titles;
}
