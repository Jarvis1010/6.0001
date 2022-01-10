// Problem Set 4A

export function getPermutations(sequence: string): Array<string> {
  if (sequence.length === 1) {
    return [sequence];
  }

  const squenceArray = sequence.split("");
  return squenceArray.reduce<Array<string>>((acc, char) => {
    const rest = squenceArray.filter((c) => c !== char);
    const restPermutations = getPermutations(rest.join(""));
    return acc.concat(restPermutations.map((r) => char + r));
  }, []);
}
