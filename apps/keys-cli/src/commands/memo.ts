import { memoPrompt } from "../prompts/memoPrompt.js";
import { addMemo } from "../services/notionMemo.js";

import { spinner } from "../utils/spinner.js";

export async function runMemo() {
  const { title } = await memoPrompt();

  await spinner("お待ちください...", async () => {
    await addMemo(title);
  });
}
