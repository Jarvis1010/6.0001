import {
  getWordScore,
  updateHand,
  isValidWord,
  getFrequencyDict,
  loadWords,
  dealHand,
} from "./pset-3";

const wordList = loadWords();
console.log(dealHand(3));

describe("pset3", () => {
  describe("getWordScore", () => {
    it.each`
      word         | n    | expected
      ${""}        | ${7} | ${0}
      ${"it"}      | ${7} | ${2}
      ${"was"}     | ${7} | ${54}
      ${"weed"}    | ${6} | ${176}
      ${"scored"}  | ${7} | ${351}
      ${"WaYbILl"} | ${7} | ${735}
      ${"Outgnaw"} | ${7} | ${539}
      ${"fork"}    | ${7} | ${209}
      ${"FORK"}    | ${4} | ${308}
      ${"h*ney"}   | ${7} | ${290}
      ${"c*ws"}    | ${6} | ${176}
      ${"wa*ls"}   | ${7} | ${203}
    `("gets the correct word score", ({ word, n, expected }) => {
      expect(getWordScore(word, n)).toBe(expected);
    });
  });

  describe("updateHand", () => {
    it.each`
      hand                                      | word       | expectedHand
      ${{ a: 1, q: 1, l: 2, m: 1, u: 1, i: 1 }} | ${"quail"} | ${{ a: 0, q: 0, l: 1, m: 1, u: 0, i: 0 }}
      ${{ e: 1, v: 2, n: 1, i: 1, l: 2 }}       | ${"Evil"}  | ${{ e: 0, v: 1, n: 1, i: 0, l: 1 }}
      ${{ h: 1, e: 1, l: 2, o: 1 }}             | ${"HELLO"} | ${{ h: 0, e: 0, l: 0, o: 0 }}
    `("should update hand", ({ hand, word, expectedHand }) => {
      const newHand = updateHand(hand, word);
      expect(newHand).toEqual(expectedHand);
      expect(newHand).not.toEqual(hand);
    });
  });

  describe("isValidWord", () => {
    it.each`
      word         | hand                                            | expected
      ${"hello"}   | ${getFrequencyDict("hello")}                    | ${true}
      ${"Rapture"} | ${{ r: 1, a: 3, p: 2, e: 1, t: 1, u: 1 }}       | ${false}
      ${"honey"}   | ${{ n: 1, h: 1, o: 1, y: 1, d: 1, w: 1, e: 2 }} | ${true}
      ${"honey"}   | ${{ r: 1, a: 3, p: 2, t: 1, u: 2 }}             | ${false}
      ${"EVIL"}    | ${{ e: 1, v: 2, n: 1, i: 1, l: 2 }}             | ${true}
      ${"Even"}    | ${{ e: 1, v: 2, n: 1, i: 1, l: 2 }}             | ${false}
    `(
      "should return true if the word is in the word list",
      ({ word, hand, expected }) => {
        const handCopy = { ...hand };

        expect(isValidWord(word, hand, wordList)).toBe(expected);
        expect(hand).toEqual(handCopy);
      }
    );

    it.each`
      word       | hand                                              | expected
      ${"e*m"}   | ${{ a: 1, r: 1, e: 1, j: 2, m: 1, "*": 1 }}       | ${false}
      ${"honey"} | ${{ n: 1, h: 1, "*": 1, y: 1, d: 1, w: 1, e: 2 }} | ${false}
      ${"h*ney"} | ${{ n: 1, h: 1, "*": 1, y: 1, d: 1, w: 1, e: 2 }} | ${true}
      ${"c*wz"}  | ${{ c: 1, o: 1, "*": 1, w: 1, s: 1, z: 1, y: 2 }} | ${false}
    `(
      "should return true if the word is in the word list using wildcard",
      ({ word, hand, expected }) => {
        const handCopy = { ...hand };

        expect(isValidWord(word, hand, wordList)).toBe(expected);
        expect(hand).toEqual(handCopy);
      }
    );
  });
});
