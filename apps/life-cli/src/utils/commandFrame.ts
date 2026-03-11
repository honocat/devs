import chalk from 'chalk';

const DIVIDER = "────────────────";

export async function runFramedCommand(run: () => Promise<void>) {
  console.log(chalk.gray(DIVIDER));
  await run();
  console.log(chalk.gray(DIVIDER));
}
