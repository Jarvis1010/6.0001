// 6.0001 Problem Set 3
//
// The 6.0001 Word Game
// Created by: Kevin Luu <luuk> and Jenna Wiens <jwiens>

import path from "path";
import fs from "fs";
import { range, randomChoice, input } from "./utils";

const VOWELS = "aeiou" as const;
const CONSONANTS = "bcdfghjklmnpqrstvwxyz" as const;
const ALPHABET = "aeioubcdfghjklmnpqrstvwxyz" as const;
const HAND_SIZE = 7;

const SCRABBLE_LETTER_VALUES: Record<string, number> = {
  a: 1,
  b: 3,
  c: 3,
  d: 2,
  e: 1,
  f: 4,
  g: 2,
  h: 4,
  i: 1,
  j: 8,
  k: 5,
  l: 1,
  m: 3,
  n: 1,
  o: 1,
  p: 3,
  q: 10,
  r: 1,
  s: 1,
  t: 1,
  u: 1,
  v: 4,
  w: 4,
  x: 8,
  y: 4,
  z: 10,
};

// -----------------------------------
// Helper code
// (you don't need to understand this helper code)

const WORDLIST_FILENAME = "words2.txt";

export function loadWords(): string[] {
  console.info("Loading word list from file...");
  const filePath = path.join(__dirname, WORDLIST_FILENAME);

  const wordlist = fs
    .readFileSync(filePath, "utf8")
    .split("\n")
    .map((word) => word.toLowerCase());
  console.info(`${wordlist.length} words loaded.`);

  return wordlist;
}

export function getFrequencyDict<T extends string | Array<string>>(
  sequence: T
): Record<T[number], number> {
  return [...sequence].reduce((acc, curr) => {
    const count = (acc[curr as T[number]] ?? 0) + 1;
    return { ...acc, [curr]: count };
  }, {} as Record<T[number], number>);
}

// (end of helper code)
// -----------------------------------

//
// Problem #1: Scoring a word
//
export function getWordScore(word: string, n: number): number {
  const rawWordScore = word
    .toLowerCase()
    .split("")
    .reduce((acc, curr) => {
      return acc + (SCRABBLE_LETTER_VALUES[curr] ?? 0);
    }, 0);

  const secondMultiplier = Math.max(1, 7 * word.length - 3 * (n - word.length));

  return rawWordScore * secondMultiplier;
}

export function displayHand(hand: Record<string, number>): void {
  const handStrings = Object.entries(hand).map(([letter, length]) =>
    Array.from({ length })
      .map(() => letter)
      .join(" ")
  );

  console.info(handStrings.join(" "));
}

// Make sure you understand how this function works and what it does!
// You will need to modify this for Problem #4.
//

export function dealHand(n: number): Record<string, number> {
  const numVowels = Math.floor(n / 3);

  const vowels = range(0, numVowels - 1)
    .map(() => randomChoice(VOWELS))
    .concat("*");

  const consonants = range(vowels.length, n).map(() =>
    randomChoice(CONSONANTS)
  );

  if (vowels.length + consonants.length !== n)
    throw new Error(
      `Expected ${n} letters, got ${vowels.length} vowels and ${consonants.length} consonants`
    );

  return vowels.concat(consonants).reduce((acc, curr) => {
    return { ...acc, [curr]: (acc[curr] ?? 0) + 1 };
  }, {} as Record<string, number>);
}

// Problem #2: Update a hand by removing letters

export function updateHand(
  hand: Record<string, number>,
  word: string
): Record<string, number> {
  const wordDick = getFrequencyDict(word.toLowerCase());
  const updatedEntries = Object.entries(hand).map(([letter, length]) => {
    const newLength = length - (wordDick[letter] ?? 0);
    return [letter, newLength];
  });

  return { ...hand, ...Object.fromEntries(updatedEntries) };
}

// Problem #3: Test word validity
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

function checkIfInWordList(word: string, wordlist: string[]) {
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

  const isInWordList = checkIfInTrie(wordListAsTrie, word);

  return { isInWordList };
}

export function isValidWord(
  word: string,
  hand: Record<string, number>,
  wordList: string[]
): boolean {
  return (
    checkIfInWordList(word.toLowerCase(), wordList).isInWordList &&
    Object.entries(getFrequencyDict(word.toLowerCase())).every(
      ([letter, count]) => hand[letter] >= count
    )
  );
}

//
// Problem #5: Playing a hand
//

function calculateHandlelen(hand: Record<string, number>): number {
  return Object.values(hand).reduce<number>((acc, length) => {
    return acc + length;
  }, 0);
}

async function playHand(hand: Record<string, number>, wordList: string[]) {
  let totalScore = 0;
  let word: string;
  do {
    console.info("Current Hand: ");
    displayHand(hand);
    word = await input(
      "Enter word, or a '!!' to indicate that you are finished: "
    );
    if (word === "!!") {
      console.info("Total score: ", totalScore);
      break;
    }
    const isValid = isValidWord(word, hand, wordList);
    if (isValid) {
      const score = getWordScore(word, calculateHandlelen(hand));
      totalScore += score;
      console.info(`"${word}" earned ${score} points. Total: ${totalScore}`);
    }

    if (!isValid) {
      console.info("That is not a valid word. Please choose another word.");
    }

    hand = updateHand(hand, word);
  } while (calculateHandlelen(hand) > 0);

  console.info(`Total score for this hand: ${totalScore}`);
  return totalScore;
}

//
// Problem #6: Playing a game
//

function substituteHand(
  hand: Record<string, number>,
  letter: string
): Record<string, number> {
  const newLetters = ALPHABET.split("")
    .filter((char) => char !== letter || (hand[char] ?? 0) === 0)
    .join("");

  const newLetter = randomChoice(newLetters);

  const { [letter]: letterValue = 0, ...rest } = hand;
  return { ...rest, [newLetter]: letterValue };
}

async function playGame(wordList: string[]) {
  const rawhandCount = await input("Enter total number of hands: ");
  const maybeHandCount = parseInt(rawhandCount, 10);
  const handCount = Number.isNaN(maybeHandCount) ? 1 : maybeHandCount;

  let totalScore = 0;

  for (let i = 0; i < handCount; i++) {
    let hand = dealHand(HAND_SIZE);
    console.info("Current Hand: ");
    displayHand(hand);

    const rowShouldSubstitute = await input(
      "Would you like to substitute a letter (Y/N)? "
    );

    if (rowShouldSubstitute[0].toLowerCase() === "y") {
      const letter = await input("Which letter would you like to replace: ");
      hand = substituteHand(hand, letter[0]);
    }

    totalScore += await playHand(hand, wordList);

    hand = dealHand(HAND_SIZE);
  }

  console.info("Total score over all hands: ", totalScore);
}

const word_list = loadWords();
playGame(word_list);
