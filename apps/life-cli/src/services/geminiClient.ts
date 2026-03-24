const GEMINI_MODEL = "gemini-2.5-flash";

const getGeminiApiKey = () => process.env.GEMINI_API_KEY;

export async function generateGeminiText(
  prompt: string,
  options?: {
    generationConfig?: {
      temperature?: number;
      topP?: number;
      topK?: number;
      maxOutputTokens?: number;
      responseMimeType?: string;
    };
  },
) {
  const apiKey = getGeminiApiKey();

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY が設定されていません。");
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...(options?.generationConfig
          ? { generationConfig: options.generationConfig }
          : {}),
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }],
          },
        ],
      }),
    },
  );

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Gemini APIエラー: ${response.status} ${errorBody}`);
  }

  const body = (await response.json()) as {
    candidates?: Array<{
      content?: {
        parts?: Array<{
          text?: string;
        }>;
      };
    }>;
  };

  const text = body.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    throw new Error("Gemini APIレスポンスからテキストを取得できませんでした。");
  }

  return text;
}

export function parseJsonFromGeminiText<T>(text: string): T {
  const sanitized = text
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```$/i, "")
    .replace(/,\s*]/g, "]");

  return JSON.parse(sanitized) as T;
}
