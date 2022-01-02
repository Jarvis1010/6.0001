import { input } from "./utils";

(async () => {
  const maybeX = await input("Enter number X: ");
  const maybeY = await input("Enter number Y: ");
  const x = parseInt(maybeX, 10);
  const y = parseInt(maybeY, 10);

  console.log(`x**y = ${x ** y}`);
  console.log(`log2(x) = ${Math.log2(x)}`);
})();
