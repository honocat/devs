import chalk from "chalk";
import { fetchBusinessNewsTitles } from "../services/newsRSS.js";
import {
  generateGeminiText,
  parseJsonFromGeminiText,
} from "../services/geminiClient.js";
import {
  AnalyzedNews,
  fetchPastMonthNews,
  saveAnalyzedNewsItems,
} from "../services/notionNews.js";

type SelectedNews = {
  title: string;
  source: string;
};

function buildSelectPrompt(newsTitles: string[]) {
  return `
        【指示】
        あなたは優秀なテック業界アナリストです。
        以下のニュースの見出し（【ニュース一覧】）から
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
        ${newsTitles.join("\n")}
    `;
}

function buildAnalyzePrompt(
  pastNews: { title: string; summary: string }[],
  selected: SelectedNews[],
) {
  const pastContext = pastNews.length
    ? pastNews.map((item) => `- ${item.title} : ${item.summary}`).join("\n")
    : "- （過去ニュースなし）";

  return `
        あなたはテック業界に詳しいビジネスアナリストです。
        入力されるニュースを、以下のユーザに向けて分析してください。
        出力は下記形式に則ったJSONのみです。

        【ユーザプロファイル】
        - 日本企業で働くソフトウェアエンジニア
        - 以下のカテゴリに関心を持つ
            - 技術トレンド
            - IT企業の戦略
            - 開発者への影響
            - プロダクト開発への影響
            - エンジニアのキャリア
        
        【分析内容】
        1. ニュース要約
        2. 技術 / ビジネス背景
        3. 過去ニュースとの関連性
        4. 今後の展望
        5. エンジニアへの示唆

        【出力形式】
        [
            {
                "title": "タイトル",
                "summary": "50文字程度の要約",
                "source": "メディア名",
                "detail": "ニュース詳細（200文字程度）",
                "trend_context": "過去ニュースとの関連",
                "future_outlook": "今後の展開予測",
                "insight": ["示唆1", "示唆2", "示唆3"]
            }
        ]
        
        【タイトル生成ルール】
        - タイトルが長い場合は40文字以内に要約する
        - 意味は変えない
        - 末尾の「- 〇〇新聞」「- Reuters」などの媒体名は削除する
        - 無駄な修飾語は省き、要点だけにする

        【過去1ヶ月のニュース】
        ${pastContext}

        【本日のニュース】
        ${JSON.stringify(selected, null, 2)}
    `;
}

export async function runNews() {
  console.log(chalk.gray("────────────────"));
  console.log(chalk.blue("おはようございます。本日の情報を収集しています..."));

  const newsTitles = await fetchBusinessNewsTitles();
  console.log(chalk.green(`✔ ニュース見出しを取得: ${newsTitles.length}件`));

  const selectedText = await generateGeminiText(buildSelectPrompt(newsTitles));
  const selected = parseJsonFromGeminiText<SelectedNews[]>(selectedText);
  console.log(chalk.green(`✔ Geminiでニュースを厳選: ${selected.length}件`));

  const pastNews = await fetchPastMonthNews();
  console.log(chalk.green(`✔ 過去1ヶ月のニュース参照: ${pastNews.length}件`));

  const analyzedText = await generateGeminiText(
    buildAnalyzePrompt(pastNews, selected),
  );
  const analyzed = parseJsonFromGeminiText<AnalyzedNews[]>(analyzedText);

  await saveAnalyzedNewsItems(analyzed);

  for (const item of analyzed) {
    console.log(chalk.white(`登録: ${item.title}`));
  }

  console.log(chalk.green("要約が完了しました。"));
  console.log(chalk.gray("────────────────"));
}
