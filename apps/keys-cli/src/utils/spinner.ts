import ora from "ora";
import chalk from "chalk";

export async function spinner<T>(
  text: string,
  fn: () => Promise<T>,
  timer?: number,
): Promise<T> {
  const s = ora(chalk.cyan(text)).start();

  if (timer && true) await new Promise((resolve) => setTimeout(resolve, timer));

  try {
    const result = await fn();
    s.succeed(chalk.green("完了"));
    return result;
  } catch (e) {
    s.fail(chalk.red("エラーが発生しました"));
    throw e;
  }
}
