// Problem Set 4C
import path from "path";
import fs from "fs";
import { getPermutations } from "./ps4a";

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

//## END HELPER CODE ###

const WORDLIST_FILENAME = "words.txt";

// you may find these constants helpful
const VOWELS_LOWER = "aeiou";
const VOWELS_UPPER = "AEIOU";
const CONSONANTS_LOWER = "bcdfghjklmnpqrstvwxyz";
const CONSONANTS_UPPER = "BCDFGHJKLMNPQRSTVWXYZ";

export class SubMessage {
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

  buildTransposeDict(vowelsPermutation: string): Record<string, string> {
    const vowelPermUpper = vowelsPermutation.toUpperCase();
    const vowelPermLower = vowelsPermutation.toLowerCase();

    const vowelEntries = VOWELS_LOWER.split("")
      .map((vowel, index) => [vowel, vowelPermLower[index]])
      .concat(
        VOWELS_UPPER.split("").map((vowel, index) => [
          vowel,
          vowelPermUpper[index],
        ])
      );

    const consonantsEntries = (CONSONANTS_LOWER + CONSONANTS_UPPER)
      .split("")
      .map((char) => [char, char]);

    return Object.fromEntries(vowelEntries.concat(consonantsEntries));
  }

  applyTranspose(transposeDict: Record<string, string>): string {
    return this.#messageText
      .split("")
      .map((char) => transposeDict[char] ?? char)
      .join("");
  }
}

export class EncryptedSubMessage extends SubMessage {
  constructor(text: string) {
    super(text);
  }
  decryptMessage(): string {
    const permutations = getPermutations(VOWELS_LOWER);
    const validWords = this.getValidWords();
    const decryptedMessages: Array<[string, number]> = permutations
      .map((permutation) =>
        this.applyTranspose(this.buildTransposeDict(permutation))
      )
      .map((message) => [
        message,
        message.split(" ").filter((word) => isWord(validWords, word)).length,
      ]);

    const bestDecryptedMessage = decryptedMessages
      .concat([this.getMessageText(), 1])
      .sort((a, b) => b[1] - a[1]);

    return bestDecryptedMessage[0][0];
  }
}
