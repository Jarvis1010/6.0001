// Problem Set 4B

import path from "path";
import fs from "fs";
import { range } from "../utils";

// ### HELPER CODE ###

export function loadWords(fileName: string): string[] {
  console.info("Loading word list from file...");
  const filePath = path.join(__dirname, fileName);

  const wordlist = fs
    .readFileSync(filePath, "utf8")
    .split("\n")
    .join("")
    .split(",")
    .join("")
    .split(" ")
    .map((word) => word.toLowerCase());
  console.info(`${wordlist.length} words loaded.`);

  return wordlist;
}

const ALPHABET = "aeioubcdfghjklmnpqrstvwxyz" as const;

type Node = {
  end: boolean;
  children: Record<typeof ALPHABET[number], Node>;
};

function addWordTrie(node: Node, word: string): void {
  if (word.length === 0) {
    node.end = true;
    return;
  }

  const key = word[0];
  const nextNode = node.children[key] ?? { end: false, children: {} };
  node.children[key] = nextNode;

  return addWordTrie(nextNode, word.slice(1));
}

function checkIfInTrie(node: Node, word: string): boolean {
  if (word.length === 0) return node.end;

  const keyToCheck = word[0] === "*" ? "aeiou" : word[0];

  return keyToCheck.split("").reduce<boolean>((acc, cur) => {
    if (acc === true) return true;
    const nextNode = node.children[cur] ?? { end: false, children: {} };
    return checkIfInTrie(nextNode, word.slice(1));
  }, false);
}

const trieMap = new Map();

export function isWord(wordlist: string[], word: string) {
  const safeWord = word
    .toLowerCase()
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "")
    .trim();

  const wordListAsTrie: Node =
    trieMap.get(wordlist) ??
    wordlist.reduce(
      (acc, word) => {
        addWordTrie(acc, word);
        return acc;
      },
      { end: false, children: {} }
    );

  trieMap.set(wordlist, wordListAsTrie);

  return checkIfInTrie(wordListAsTrie, safeWord);
}

export function getStoryString() {
  return fs.readFileSync(path.join(__dirname, "story.txt"), "utf8");
}

// ### END HELPER CODE ###

const WORDLIST_FILENAME = "words.txt";

export class Message {
  #messageText: string;
  #validWords: string[];
  constructor(text: string) {
    this.#messageText = text;
    this.#validWords = loadWords(WORDLIST_FILENAME);
  }

  getMessageText(): string {
    return this.#messageText;
  }

  getValidWords(): string[] {
    return [...this.#validWords];
  }

  buildShiftDict(shift: number): Record<string, string> {
    const alphabet = ALPHABET.split("");

    const UPPER_CASE_A_CODE = "A".charCodeAt(0);
    const LOWER_CASE_A_CODE = "a".charCodeAt(0);
    const CASE_DIFFERENCE = UPPER_CASE_A_CODE - LOWER_CASE_A_CODE;

    const lowerCaseEntries: Array<[string, number]> = alphabet.map((letter) => [
      letter,
      ((letter.charCodeAt(0) - LOWER_CASE_A_CODE + shift) % 26) +
        LOWER_CASE_A_CODE,
    ]);

    const upperCaseEntries: Array<[string, number]> = lowerCaseEntries.map(
      ([letter, code]) => [letter.toUpperCase(), code + CASE_DIFFERENCE]
    );

    const dictEntries: Array<[string, string]> = [
      ...lowerCaseEntries,
      ...upperCaseEntries,
    ].map(([letter, code]) => [letter, String.fromCharCode(code)]);

    return Object.fromEntries(dictEntries);
  }

  applyShift(shift: number): string {
    const shiftDict = this.buildShiftDict(shift);
    return this.#messageText
      .split("")
      .map((letter) => shiftDict[letter] ?? letter)
      .join("");
  }
}

export class PlaintextMessage extends Message {
  #encryptionDict: Record<string, string>;
  #shift: number;
  #messageTextEncrypted: string;

  constructor(text: string, shift: number) {
    super(text);
    this.#shift = shift;
    this.#encryptionDict = this.buildShiftDict(shift);
    this.#messageTextEncrypted = this.applyShift(shift);
  }

  getShift(): number {
    return this.#shift;
  }

  getEncryptedMessage(): string {
    return this.#messageTextEncrypted;
  }

  getMessageTextEncrypted(): string {
    return this.#messageTextEncrypted;
  }

  changeShift(shift: number): void {
    this.#shift = shift;
    this.#encryptionDict = this.buildShiftDict(shift);
    this.#messageTextEncrypted = this.applyShift(shift);
  }
}
export class CiphertextMessage extends Message {
  constructor(text: string) {
    super(text);
  }

  decryptMessage(): [number, string] {
    const wordList = this.getValidWords();

    const shiftRanks = range(1, 26)
      .map((shift) => {
        const dycryptWords = this.applyShift(shift).split(" ");

        return [
          shift,
          dycryptWords.filter((word) => isWord(wordList, word)).length,
        ];
      })
      .sort((a, b) => b[1] - a[1]);

    const [shift] = shiftRanks[0];

    return [shift, this.applyShift(shift)];
  }
}
