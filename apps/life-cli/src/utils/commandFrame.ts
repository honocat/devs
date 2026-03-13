import chalk from "chalk";

const DIVIDER = "────────────────";

export async function runFramedCommand(run: () => Promise<void>) {
  console.log(chalk.gray(DIVIDER));
  try {
    await run();
  } finally {
    console.log(chalk.gray(DIVIDER));
  }
}
