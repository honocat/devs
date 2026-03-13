import chalk from "chalk";
import { runFramedCommand } from "./commandFrame.js";

export async function runSimpleCommand<T>(options: {
  prompt: () => Promise<T>;
  submit: (answers: T) => Promise<void>;
  successMessage: string;
}) {
  await runFramedCommand(async () => {
    const answers = await options.prompt();
    await options.submit(answers);
    console.log(chalk.green(options.successMessage));
  });
}
