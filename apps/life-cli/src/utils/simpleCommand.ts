import chalk from "chalk";
import { runFramedCommand } from "./commandFrame.js";

export async function runSimpleCommand<T>(options: {
  before?: () => Promise<void>;
  prompt: () => Promise<T>;
  submit: (answers: T) => Promise<void>;
  after?: (answers: T) => Promise<void>;
  successMessage: string;
}) {
  await runFramedCommand(async () => {
    if (options.before) {
      await options.before();
    }
    const answers = await options.prompt();
    await options.submit(answers);
    if (options.after) {
      await options.after(answers);
    }
    console.log(chalk.green(options.successMessage));
  });
}
