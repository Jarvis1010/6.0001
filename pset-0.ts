import * as readline from "readline";
import { promisify } from "util";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function input(prompt: string): Promise<string> {
  return new Promise((r) => rl.question(prompt, r));
}

(async () => {
  const maybeX = await input("Enter number X: ");
  const maybeY = await input("Enter number Y: ");
  const x = parseInt(maybeX, 10);
  const y = parseInt(maybeY, 10);

  console.log(`x**y = ${x ** y}`);
  console.log(`log2(x) = ${Math.log2(x)}`);
  rl.close();
})();
