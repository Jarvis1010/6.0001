// 6.0001 Problem Set 3
//
// The 6.0001 Word Game
// Created by: Kevin Luu <luuk> and Jenna Wiens <jwiens>

import path from "path";
import fs from "fs";
import { range, randomChoice } from "./utils";

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

  console.log(handStrings.join(" "));
}

// Make sure you understand how this function works and what it does!
// You will need to modify this for Problem #4.
//

export function dealHand(n: number): Record<string, number> {
  const numVowels = Math.floor(n / 3);
  console.log(range(0, numVowels - 1));
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
// def calculate_handlen(hand):
//     """
//     Returns the length (number of letters) in the current hand.

//     hand: dictionary (string-> int)
//     returns: integer
//     """

//     pass  # TO DO... Remove this line when you implement this function

// def play_hand(hand, word_list):

//     """
//     Allows the user to play the given hand, as follows:

//     * The hand is displayed.

//     * The user may input a word.

//     * When any word is entered (valid or invalid), it uses up letters
//       from the hand.

//     * An invalid word is rejected, and a message is displayed asking
//       the user to choose another word.

//     * After every valid word: the score for that word is displayed,
//       the remaining letters in the hand are displayed, and the user
//       is asked to input another word.

//     * The sum of the word scores is displayed when the hand finishes.

//     * The hand finishes when there are no more unused letters.
//       The user can also finish playing the hand by inputing two
//       exclamation points (the string '!!') instead of a word.

//       hand: dictionary (string -> int)
//       word_list: list of lowercase strings
//       returns: the total score for the hand

//     """

//     # BEGIN PSEUDOCODE <-- Remove this comment when you implement this function
//     # Keep track of the total score

//     # As long as there are still letters left in the hand:

//         # Display the hand

//         # Ask user for input

//         # If the input is two exclamation points:

//             # End the game (break out of the loop)

//         # Otherwise (the input is not two exclamation points):

//             # If the word is valid:

//                 # Tell the user how many points the word earned,
//                 # and the updated total score

//             # Otherwise (the word is not valid):
//                 # Reject invalid word (print a message)

//             # update the user's hand by removing the letters of their inputted word

//     # Game is over (user entered '!!' or ran out of letters),
//     # so tell user the total score

//     # Return the total score as result of function

//
// Problem #6: Playing a game
//

//
// procedure you will use to substitute a letter in a hand
//

// def substitute_hand(hand, letter):
//     """
//     Allow the user to replace all copies of one letter in the hand (chosen by user)
//     with a new letter chosen from the VOWELS and CONSONANTS at random. The new letter
//     should be different from user's choice, and should not be any of the letters
//     already in the hand.

//     If user provide a letter not in the hand, the hand should be the same.

//     Has no side effects: does not mutate hand.

//     For example:
//         substitute_hand({'h':1, 'e':1, 'l':2, 'o':1}, 'l')
//     might return:
//         {'h':1, 'e':1, 'o':1, 'x':2} -> if the new letter is 'x'
//     The new letter should not be 'h', 'e', 'l', or 'o' since those letters were
//     already in the hand.

//     hand: dictionary (string -> int)
//     letter: string
//     returns: dictionary (string -> int)
//     """

//     pass  # TO DO... Remove this line when you implement this function

// def play_game(word_list):
//     """
//     Allow the user to play a series of hands

//     * Asks the user to input a total number of hands

//     * Accumulates the score for each hand into a total score for the
//       entire series

//     * For each hand, before playing, ask the user if they want to substitute
//       one letter for another. If the user inputs 'yes', prompt them for their
//       desired letter. This can only be done once during the game. Once the
//       substitue option is used, the user should not be asked if they want to
//       substitute letters in the future.

//     * For each hand, ask the user if they would like to replay the hand.
//       If the user inputs 'yes', they will replay the hand and keep
//       the better of the two scores for that hand.  This can only be done once
//       during the game. Once the replay option is used, the user should not
//       be asked if they want to replay future hands. Replaying the hand does
//       not count as one of the total number of hands the user initially
//       wanted to play.

//             * Note: if you replay a hand, you do not get the option to substitute
//                     a letter - you must play whatever hand you just had.

//     * Returns the total score for the series of hands

//     word_list: list of lowercase strings
//     """

//     print("play_game not implemented.") # TO DO... Remove this line when you implement this function

//
// Build data structures used for entire session and play game
// Do not remove the "if __name__ == '__main__':" line - this code is executed
// when the program is run directly, instead of through an import statement
//
// if __name__ == '__main__':
//     word_list = load_words()
//     play_game(word_list)
