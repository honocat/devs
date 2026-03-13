import { balancePrompt } from "../prompts/balancePrompt.js";
import { addBalance } from "../services/notionBalance.js";
import { runSimpleCommand } from "../utils/simpleCommand.js";

export async function runBalance() {
  await runSimpleCommand({
    prompt: balancePrompt,
    submit: async ({ item, amount }) => addBalance(item, amount),
    successMessage: "✔ balance added",
  });
}
