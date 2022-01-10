import { getPermutations } from "./ps4a";
import {
  loadWords,
  isWord,
  Message,
  PlaintextMessage,
  CiphertextMessage,
} from "./ps4b";
import { SubMessage, EncryptedSubMessage } from "./ps4c";

const WORDLIST = loadWords("./words.txt");

describe("pset-4", () => {
  describe("getPermutations", () => {
    test.each`
      permutation | expected
      ${"a"}      | ${["a"]}
      ${"ab"}     | ${["ab", "ba"]}
      ${"la"}     | ${["la", "al"]}
      ${"abc"}    | ${["abc", "acb", "bac", "bca", "cab", "cba"]}
      ${"bat"}    | ${["bat", "bta", "atb", "abt", "tab", "tba"]}
    `("return all the permutations", ({ permutation, expected }) => {
      const actual = getPermutations(permutation);

      expect(actual.sort()).toEqual(expected.sort());
    });
  });

  describe("isWord", () => {
    test.each`
      wordlist    | word      | expected
      ${WORDLIST} | ${"bat"}  | ${true}
      ${WORDLIST} | ${"asdf"} | ${false}
      ${WORDLIST} | ${""}     | ${false}
    `("returns true if word is in wordlist", ({ wordlist, word, expected }) => {
      expect(isWord(wordlist, word)).toEqual(expected);
    });
  });

  describe("Message", () => {
    test("returns applied shift to text", () => {
      const message = new Message("hello");
      expect(message.applyShift(2)).toEqual("jgnnq");
    });

    test("returns cipher dict", () => {
      const message = new Message("bat");
      expect(message.buildShiftDict(1)).toMatchInlineSnapshot(`
Object {
  "A": "B",
  "B": "C",
  "C": "D",
  "D": "E",
  "E": "F",
  "F": "G",
  "G": "H",
  "H": "I",
  "I": "J",
  "J": "K",
  "K": "L",
  "L": "M",
  "M": "N",
  "N": "O",
  "O": "P",
  "P": "Q",
  "Q": "R",
  "R": "S",
  "S": "T",
  "T": "U",
  "U": "V",
  "V": "W",
  "W": "X",
  "X": "Y",
  "Y": "Z",
  "Z": "A",
  "a": "b",
  "b": "c",
  "c": "d",
  "d": "e",
  "e": "f",
  "f": "g",
  "g": "h",
  "h": "i",
  "i": "j",
  "j": "k",
  "k": "l",
  "l": "m",
  "m": "n",
  "n": "o",
  "o": "p",
  "p": "q",
  "q": "r",
  "r": "s",
  "s": "t",
  "t": "u",
  "u": "v",
  "v": "w",
  "w": "x",
  "x": "y",
  "y": "z",
  "z": "a",
}
`);
    });
  });

  describe("PlaintextMessage", () => {
    test("Encrypts message", () => {
      const message = new PlaintextMessage("hello", 2);
      expect(message.getEncryptedMessage()).toEqual("jgnnq");
    });

    test("changes shift", () => {
      const message = new PlaintextMessage("hello", 2);
      message.changeShift(3);
      expect(message.getEncryptedMessage()).toEqual("khoor");
    });
  });

  describe("CiphertextMessage", () => {
    test("decrypts message", () => {
      const message = new CiphertextMessage("jgnnq");
      expect(message.decryptMessage()).toEqual([24, "hello"]);
    });
  });

  describe("SubMessage", () => {
    test("builds dict", () => {
      const message = new SubMessage("hello");
      const dict = message.buildTransposeDict("eioua");

      expect(dict).toMatchInlineSnapshot(`
Object {
  "A": "E",
  "B": "B",
  "C": "C",
  "D": "D",
  "E": "I",
  "F": "F",
  "G": "G",
  "H": "H",
  "I": "O",
  "J": "J",
  "K": "K",
  "L": "L",
  "M": "M",
  "N": "N",
  "O": "U",
  "P": "P",
  "Q": "Q",
  "R": "R",
  "S": "S",
  "T": "T",
  "U": "A",
  "V": "V",
  "W": "W",
  "X": "X",
  "Y": "Y",
  "Z": "Z",
  "a": "e",
  "b": "b",
  "c": "c",
  "d": "d",
  "e": "i",
  "f": "f",
  "g": "g",
  "h": "h",
  "i": "o",
  "j": "j",
  "k": "k",
  "l": "l",
  "m": "m",
  "n": "n",
  "o": "u",
  "p": "p",
  "q": "q",
  "r": "r",
  "s": "s",
  "t": "t",
  "u": "a",
  "v": "v",
  "w": "w",
  "x": "x",
  "y": "y",
  "z": "z",
}
`);
    });

    test("encrypts message", () => {
      const message = new SubMessage("hello");
      const dict = message.buildTransposeDict("eioua");

      expect(message.applyTranspose(dict)).toEqual("hillu");
    });
  });

  describe("EncryptedSubMessage", () => {
    test("returns best decrypted message", () => {
      const message = new EncryptedSubMessage("hillu");
      expect(message.decryptMessage()).toBe("hello");
    });

    test("returns original if no best available", () => {
      const message = new EncryptedSubMessage("asidjf;alsdkjf");
      expect(message.decryptMessage()).toBe("asidjf;alsdkjf");
    });
  });
});
