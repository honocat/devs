import chalk from "chalk";
import {
  generateGeminiText,
  parseJsonFromGeminiText,
} from "../services/geminiClient.js";
import {
  AnalyzedNews,
  saveAnalyzedNewsItems,
} from "../services/notionNews.js";
import { enrichNewsWithBody, fetchBusinessNews } from "../services/newsRSS.js";
import { runFramedCommand } from "../utils/commandFrame.js";

type SelectedNews = {
  title: string;
  source: string;
};

type NewsForAnalysisInput = SelectedNews & {
  id: number;
  link: string;
  body: string;
};

function normalizeText(value: string) {
  return value
    .normalize("NFKC")
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/["'”“’]/g, "")
    .replace(/[｜|].*$/g, "")
    .replace(/[-–—ー]\s*[^-–—ー]+$/g, "")
    .trim();
}

function normalizeForMatch(value: string) {
  return value.normalize("NFKC").replace(/\s+/g, "");
}

function isExtractedFromBody(body: string, excerpt: string) {
  const normalizedExcerpt = normalizeForMatch(excerpt);
  if (normalizedExcerpt.length === 0 || excerpt === "不明") {
    return true;
  }
  return normalizeForMatch(body).includes(normalizedExcerpt);
}

function pickSelectedNewsItems(
  newsItems: { title: string; source: string; snippet: string; link: string }[],
  selected: SelectedNews[],
) {
  const usedLinks = new Set<string>();
  const picked: (typeof newsItems)[number][] = [];

  for (const candidate of selected) {
    const normalizedTitle = normalizeText(candidate.title);
    const normalizedSource = normalizeText(candidate.source);

    const exact = newsItems.find((item) => {
      if (usedLinks.has(item.link)) {
        return false;
      }

      return (
        normalizeText(item.title) === normalizedTitle &&
        normalizeText(item.source) === normalizedSource
      );
    });

    if (exact) {
      usedLinks.add(exact.link);
      picked.push(exact);
      continue;
    }

    const titleOnly = newsItems.find((item) => {
      if (usedLinks.has(item.link)) {
        return false;
      }

      const itemTitle = normalizeText(item.title);
      return (
        itemTitle === normalizedTitle ||
        itemTitle.includes(normalizedTitle) ||
        normalizedTitle.includes(itemTitle)
      );
    });

    if (titleOnly) {
      usedLinks.add(titleOnly.link);
      picked.push(titleOnly);
    }
  }

  return picked;
}

function buildSelectPrompt(
  newsItems: { title: string; source: string; snippet: string }[],
) {
  const newsList = newsItems
    .map(
      (item, index) =>
        `${index + 1}. ${item.title} (${item.source}) \n概要：${item.snippet}`,
    )
    .join("\n\n");

  return `
        【指示】
        あなたは優秀なテック業界アナリストです。
        以下のニュース（【ニュース一覧】）から
        ユーザ（【ユーザプロファイル】）にとって重要なニュースを、
        多様性を考慮して5件選んでください。
        ただし、各ニュースは下記カテゴリ（【カテゴリ】）のどれかに分類し、
        そのうえで選定ルール（【選定ルール】）を満たすものとします。
        出力は下記形式（【出力形式】）に則ったJSONのみです。

        【ユーザプロファイル】
        - 日本企業で働くソフトウェアエンジニア
        - 技術トレンド、AI、IT企業戦略に関心
        - ソフトウェア開発やプロダクト戦略に役立つ情報を重視

        【カテゴリ】
        - マクロ経済（米国経済、金利、為替、景気など）
        - テクノロジー（AI、IT企業、半導体など）
        - ビジネス戦略（企業買収、事業戦略など）
        - 産業トレンド（自動車、エネルギー、製造など）
        - 社会・政策（規制、法律など）
        - その他（以上のどれにも当てはまらないもの）

        【選定ルール】
        - 合計5件のニュースを選ぶ
        - 同カテゴリは最大2件
        - テクノロジーは最大2件
        - マクロ経済を最低1件は含める

        【出力形式】
        [
            {
                "title": "タイトル",
                "source": "媒体名"
            }
        ]

        【ニュース一覧】
        ${newsList}
    `;
}

function buildAnalyzePrompt(
  selected: NewsForAnalysisInput[],
) {
  return `
        あなたはニュースの「抽出要約」ツールです。
        入力として渡される各ニュースの本文（body）から、事実だけを抜き出してください。
        重要: bodyに書いていない情報は絶対に書かない（推測・補完・外部知識は禁止）。
        出力は必ず JSON のみ（前後の説明文やコードフェンス禁止）。

        【ユーザプロファイル】
        - 日本企業で働くソフトウェアエンジニア
        - 以下のカテゴリに関心を持つ
            - 技術トレンド
            - IT企業の戦略
            - 開発者への影響
            - プロダクト開発への影響
            - エンジニアのキャリア
        
        【抽出ルール】
        - summary/detail/trend_context/future_outlook/insight は、必ず body に含まれる文字列をそのまま使う
        - 言い換え・要約・推測は禁止（コピペに近い抽出のみ）
        - body に根拠がない場合は "不明"、insight は [] にする
        - 出力内の id は入力と同じ id を必ず返す

        【出力形式】
        [
            {
                "id": 0,
                "summary": "本文からの抜粋（短く）。無ければ不明",
                "detail": "本文からの抜粋（長め）。無ければ不明",
                "trend_context": "本文に過去ニュースとの関連が書いてあればその抜粋。無ければ不明",
                "future_outlook": "本文に今後の展望が書いてあればその抜粋。無ければ不明",
                "insight": ["本文に明示的に書かれている示唆の抜粋のみ。なければ[]"]
            }
        ]

        【本日のニュース（本文付き）】
        ${JSON.stringify(selected, null, 2)}
    `;
}

type GeminiExtractiveOutput = {
  id: number;
  summary: string;
  detail: string;
  trend_context: string;
  future_outlook: string;
  insight: string[];
};

export async function runNews() {
  await runFramedCommand(async () => {
    console.log(
      chalk.white("おはようございます。本日の情報を収集しています..."),
    );

    const newsItems = await fetchBusinessNews();
    console.log(chalk.green(`✔ ニュース一覧を取得: ${newsItems.length}件`));

    const selectedText = await generateGeminiText(buildSelectPrompt(newsItems));
    const selected = parseJsonFromGeminiText<SelectedNews[]>(selectedText);
    console.log(chalk.green(`✔ Geminiでニュースを厳選: ${selected.length}件`));

    const selectedItems = pickSelectedNewsItems(newsItems, selected);

    if (selectedItems.length === 0 && newsItems.length > 0) {
      selectedItems.push(...newsItems.slice(0, 5));
      console.log(
        chalk.yellow(
          "⚠ Geminiの選定結果をニュース一覧に突合できなかったため、取得順の先頭5件で処理を継続します。",
        ),
      );
    }

    const enrichedSelected = await enrichNewsWithBody(selectedItems);
    console.log(
      chalk.green(`✔ ニュース本文を取得: ${enrichedSelected.length}件`),
    );

    const analysisInputs: NewsForAnalysisInput[] = enrichedSelected.map(
      ({ title, source, body, link }, index) => ({
        id: index,
        title,
        source,
        link,
        body,
      }),
    );

    let geminiOutput: GeminiExtractiveOutput[] = [];
    try {
      const analyzedText = await generateGeminiText(
        buildAnalyzePrompt(analysisInputs),
        {
          generationConfig: {
            temperature: 0,
            topP: 0.1,
            responseMimeType: "application/json",
          },
        },
      );
      geminiOutput = parseJsonFromGeminiText<GeminiExtractiveOutput[]>(
        analyzedText,
      );
    } catch (error) {
      console.log(
        chalk.yellow(
          "⚠ Geminiの抽出要約に失敗したため、本文のみ保存できる形で処理を継続します。",
        ),
      );
      console.log(chalk.gray(String(error)));
    }

    const outputsById = new Map<number, GeminiExtractiveOutput>();
    for (const out of geminiOutput) {
      if (typeof out?.id === "number" && Number.isFinite(out.id)) {
        outputsById.set(out.id, out);
      }
    }

    const analyzed: AnalyzedNews[] = analysisInputs.map((input) => {
      const out = outputsById.get(input.id);
      const safe = {
        summary: out?.summary ?? "不明",
        detail: out?.detail ?? "不明",
        trend_context: out?.trend_context ?? "不明",
        future_outlook: out?.future_outlook ?? "不明",
        insight: Array.isArray(out?.insight) ? out!.insight : [],
      };

      const summary = isExtractedFromBody(input.body, safe.summary)
        ? safe.summary
        : "不明";
      const detail = isExtractedFromBody(input.body, safe.detail)
        ? safe.detail
        : "不明";
      const trend_context = isExtractedFromBody(input.body, safe.trend_context)
        ? safe.trend_context
        : "不明";
      const future_outlook = isExtractedFromBody(input.body, safe.future_outlook)
        ? safe.future_outlook
        : "不明";
      const insight = safe.insight.filter((line) =>
        typeof line === "string" ? isExtractedFromBody(input.body, line) : false,
      );

      return {
        title: input.title,
        source: input.source,
        link: input.link,
        body: input.body,
        summary,
        detail,
        trend_context,
        future_outlook,
        insight,
      };
    });

    await saveAnalyzedNewsItems(analyzed);

    for (const item of analyzed) {
      console.log(chalk.white(`登録: ${item.title}`));
    }

    console.log(chalk.green("✔ 要約が完了しました。"));
  });
}
