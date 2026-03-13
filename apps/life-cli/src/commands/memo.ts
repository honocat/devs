import { memoPrompt } from "../prompts/memoPrompt.js";
import { addMemo } from "../services/notionMemo.js";
import { runSimpleCommand } from "../utils/simpleCommand.js";

export async function runMemo() {
  await runSimpleCommand({
    prompt: memoPrompt,
    submit: async ({ title }) => addMemo(title, "タスク"),
    successMessage: "✔ memo added",
  });
}
