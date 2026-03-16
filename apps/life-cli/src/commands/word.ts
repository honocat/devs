import { wordPrompt } from "../prompts/wordPrompt.js";
import { addWord } from "../services/notionWords.js";
import { runSimpleCommand } from "../utils/simpleCommand.js";

export async function runWord() {
  await runSimpleCommand({
    prompt: wordPrompt,
    submit: async ({ name }) => addWord(name),
    successMessage: "✔ word added",
  });
}

