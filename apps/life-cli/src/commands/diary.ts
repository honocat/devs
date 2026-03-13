import { diaryPrompt } from "../prompts/diaryPrompt.js";
import { addMemo } from "../services/notionMemo.js";
import { runSimpleCommand } from "../utils/simpleCommand.js";

export async function runDiary() {
  await runSimpleCommand({
    prompt: diaryPrompt,
    submit: async ({ content }) => addMemo(content, "日記"),
    successMessage: "✔ diary added",
  });
}
