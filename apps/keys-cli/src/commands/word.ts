import { wordPrompt } from "../prompts/wordPrompt.js";
import { addWord } from "../services/notionWord.js";

import { spinner } from "../utils/spinner.js";

export async function runWord() {
  const { name } = await wordPrompt();

  await spinner("お待ちください", async () => {
    await addWord(name);
  });
}
