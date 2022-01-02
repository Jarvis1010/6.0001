import { input, range } from "./utils";

(async () => {
  const maybeX = await input("Enter number X: ");
  const maybeY = await input("Enter number Y: ");
  const x = parseInt(maybeX, 10);
  const y = parseInt(maybeY, 10);

  for (const i of range(x, y)) {
    console.log(i);
  }
})();
