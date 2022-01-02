import * as readline from "readline";

export function input(prompt: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((r) =>
    rl.question(prompt, (answer) => {
      rl.close();
      r(answer);
    })
  );
}

export function range(start: number, end: number): number[] {
  if (start > end) throw new Error("Start must be less than end");

  return Array.from(Array(end - start + 1).keys()).map((i) => start + i);
}
