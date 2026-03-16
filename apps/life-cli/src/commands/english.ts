import chalk from "chalk";
import {
  englishEssayPrompt,
  japaneseEssayPrompt,
  retryEnglishPrompt,
} from "../prompts/englishPrompt.js";
import {
  generateGeminiText,
  parseJsonFromGeminiText,
} from "../services/geminiClient.js";
import { addMemo } from "../services/notionMemo.js";
import { runFramedCommand } from "../utils/commandFrame.js";

type ErrorSpotType =
  | "grammar"
  | "article"
  | "preposition"
  | "word_choice"
  | "tense"
  | "plural"
  | "punctuation"
  | "other";

type EnglishReview = {
  score: number;
  overall_comment: string;
  error_spots: Array<{
    quote: string;
    type: ErrorSpotType;
    issue: string;
    fix: string;
  }>;
  corrected_version: string;
  natural_version: string;
  important_phrases: Array<{
    phrase: string;
    meaning_ja: string;
    note?: string;
  }>;
};

const MAX_RICH_TEXT_CHARS = 1800;

function splitToChunks(text: string, maxChars: number) {
  const chunks: string[] = [];
  let rest = text;

  while (rest.length > maxChars) {
    chunks.push(rest.slice(0, maxChars));
    rest = rest.slice(maxChars);
  }

  if (rest.length > 0) {
    chunks.push(rest);
  }

  return chunks;
}

function toParagraphBlocks(text: string) {
  const normalized = text.replace(/\r\n/g, "\n").trim();
  if (normalized.length === 0) {
    return [];
  }

  const paragraphs = normalized.split(/\n{2,}/g);
  const blocks: any[] = [];

  for (const paragraph of paragraphs) {
    const trimmed = paragraph.trim();
    if (trimmed.length === 0) {
      continue;
    }

    for (const chunk of splitToChunks(trimmed, MAX_RICH_TEXT_CHARS)) {
      blocks.push({
        object: "block",
        type: "paragraph",
        paragraph: {
          rich_text: [{ type: "text", text: { content: chunk } }],
        },
      });
    }
  }

  return blocks;
}

function heading3(text: string) {
  return {
    object: "block",
    type: "heading_3",
    heading_3: {
      rich_text: [{ type: "text", text: { content: text } }],
    },
  };
}

function heading2(text: string) {
  return {
    object: "block",
    type: "heading_2",
    heading_2: {
      rich_text: [{ type: "text", text: { content: text } }],
    },
  };
}

function bullet(text: string) {
  const normalized = text.replace(/\r\n/g, "\n").trim();
  if (normalized.length === 0) {
    return null;
  }

  const chunks = splitToChunks(normalized, MAX_RICH_TEXT_CHARS);
  return chunks.map((chunk) => ({
    object: "block",
    type: "bulleted_list_item",
    bulleted_list_item: {
      rich_text: [{ type: "text", text: { content: chunk } }],
    },
  }));
}

function buildReviewPrompt(japanese: string, english: string) {
  return `
【役割】
あなたは英語ネイティブの編集者です。入力された「日本語」と「ユーザ英文」を比較し、英語として正しいかを厳密にレビューしてください。

【最重要】
- 出力は JSON のみ（前後の説明文・コードフェンス禁止）
- "quote" はユーザ英文からの短い抜粋（そのまま一致する文字列）にする
- 指摘は「文法」「冠詞」「前置詞」「語法/語彙選択」「時制」「複数形」「句読点」などを含め、どこがどう誤りかを明確にする
- "natural_version" はネイティブが自然に言う全文
- "important_phrases" には重要語句（英語フレーズ）と日本語の意味を入れる（3〜8個）

【出力JSONスキーマ（この形を厳守）】
{
  "score": 1〜10の整数,
  "overall_comment": "総評",
  "error_spots": [
    {
      "quote": "誤り箇所の抜粋（短く）",
      "type": "grammar|article|preposition|word_choice|tense|plural|punctuation|other",
      "issue": "何が誤りか",
      "fix": "どう直すか（置換後の表現）"
    }
  ],
  "corrected_version": "ユーザ英文を最小限の修正で正しくした全文",
  "natural_version": "ネイティブが自然に言う全文",
  "important_phrases": [
    { "phrase": "重要語句", "meaning_ja": "日本語の意味", "note": "用法メモ（任意）" }
  ]
}

【入力】
日本語:
${JSON.stringify(japanese)}

ユーザ英文:
${JSON.stringify(english)}
`.trim();
}

function looksLikeEnglishReview(value: unknown): value is EnglishReview {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const v = value as Partial<EnglishReview>;
  return (
    typeof v.score === "number" &&
    typeof v.overall_comment === "string" &&
    typeof v.corrected_version === "string" &&
    typeof v.natural_version === "string" &&
    Array.isArray(v.error_spots) &&
    Array.isArray(v.important_phrases)
  );
}

function printReview(review: EnglishReview) {
  console.log(chalk.cyan("🧠 Geminiレビュー"));
  console.log(chalk.white(`Score: ${review.score}/10`));
  console.log(chalk.white(review.overall_comment));
  console.log();

  console.log(chalk.cyan("❌ 間違い（該当箇所つき）"));
  if (review.error_spots.length === 0) {
    console.log(chalk.gray("（大きな誤りは見つかりませんでした）"));
  } else {
    for (const spot of review.error_spots) {
      console.log(chalk.white(`- [${spot.type}] "${spot.quote}"`));
      console.log(chalk.gray(`  issue: ${spot.issue}`));
      console.log(chalk.green(`  fix:   ${spot.fix}`));
    }
  }
  console.log();

  console.log(chalk.cyan("🟩 正しい英文（最小修正）"));
  console.log(chalk.white(review.corrected_version));
  console.log();

  console.log(chalk.cyan("🟦 ネイティブが自然に言う英文"));
  console.log(chalk.white(review.natural_version));
  console.log();

  console.log(chalk.cyan("🔑 重要語句"));
  if (review.important_phrases.length === 0) {
    console.log(chalk.gray("（なし）"));
  } else {
    for (const p of review.important_phrases) {
      const note =
        typeof p.note === "string" && p.note.trim().length > 0
          ? ` (${p.note.trim()})`
          : "";
      console.log(chalk.white(`- ${p.phrase}: ${p.meaning_ja}${note}`));
    }
  }
}

function buildNotionChildren(
  english: string,
  review: EnglishReview | { raw: string },
) {
  const children: any[] = [];

  children.push(heading2("英作文"));
  children.push(heading3("User English"));
  children.push(...toParagraphBlocks(english));

  children.push(heading3("Gemini Review"));

  if ("raw" in review) {
    children.push(...toParagraphBlocks(review.raw));
    return children;
  }

  children.push(...toParagraphBlocks(`Score: ${review.score}/10`));
  children.push(...toParagraphBlocks(review.overall_comment));

  children.push(heading3("Error Spots"));
  if (review.error_spots.length === 0) {
    children.push(...toParagraphBlocks("（大きな誤りは見つかりませんでした）"));
  } else {
    for (const spot of review.error_spots) {
      const line = `[${spot.type}] "${spot.quote}"\nissue: ${spot.issue}\nfix: ${spot.fix}`;
      const bullets = bullet(line);
      if (bullets) {
        children.push(...bullets);
      }
    }
  }

  children.push(heading3("Corrected Version"));
  children.push(...toParagraphBlocks(review.corrected_version));

  children.push(heading3("Natural Version"));
  children.push(...toParagraphBlocks(review.natural_version));

  children.push(heading3("Important Phrases"));
  if (review.important_phrases.length === 0) {
    children.push(...toParagraphBlocks("（なし）"));
  } else {
    for (const p of review.important_phrases) {
      const note =
        typeof p.note === "string" && p.note.trim().length > 0
          ? ` / note: ${p.note.trim()}`
          : "";
      const line = `${p.phrase} — ${p.meaning_ja}${note}`;
      const bullets = bullet(line);
      if (bullets) {
        children.push(...bullets);
      }
    }
  }

  return children;
}

export async function runEnglish() {
  await runFramedCommand(async () => {
    const { japanese } = await japaneseEssayPrompt();

    let { english } = await englishEssayPrompt();
    let lastReview: EnglishReview | { raw: string } | null = null;

    while (true) {
      console.log(chalk.gray("\nGeminiでレビューしています..."));

      const prompt = buildReviewPrompt(japanese, english);
      const reviewText = await generateGeminiText(prompt);

      try {
        const parsed = parseJsonFromGeminiText<unknown>(reviewText);
        if (!looksLikeEnglishReview(parsed)) {
          throw new Error("JSONは取得できましたが、期待する形式ではありません。");
        }
        lastReview = parsed;
        printReview(parsed);
      } catch (error) {
        lastReview = { raw: reviewText };
        console.log(
          chalk.yellow(
            "⚠ レビューのJSONパースに失敗しました。Gemini出力（生）を表示します。",
          ),
        );
        console.log(chalk.white(reviewText));
        console.log(chalk.gray(String(error)));
      }

      const { retry } = await retryEnglishPrompt();
      if (!retry) {
        break;
      }

      const next = await englishEssayPrompt(english);
      english = next.english;
    }

    const notionChildren = buildNotionChildren(
      english,
      lastReview ?? { raw: "（レビューなし）" },
    );

    await addMemo(japanese, "英語", notionChildren);
    console.log(chalk.green("✔ Notionに英作文ログを保存しました"));
  });
}
