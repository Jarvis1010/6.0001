import fs from "fs";
import path from "path";
import { input } from "./utils";
const WORDLIST_FILENAME = "words.txt";

function loadWords(): string[] {
  console.info("Loading word list from file...");
  const filePath = path.join(__dirname, WORDLIST_FILENAME);

  const wordlist = fs.readFileSync(filePath, "utf8").split(" ");
  console.info(`${wordlist.length} words loaded.`);

  return wordlist;
}

function chooseWord(wordlist: string[]) {
  const randomIndex = Math.floor(
    Math.random() * (wordlist.length - 1 - 0 + 1) + 0
  );
  return wordlist[randomIndex];
}

function isWordGuessed(secretWord: string, lettersGuessed: string[]): boolean {
  return secretWord
    .split("")
    .every((letter) => lettersGuessed.includes(letter));
}

function getGuessedWord(secretWord: string, lettersGuessed: string[]): string {
  return secretWord
    .split("")
    .map((letter) => (lettersGuessed.includes(letter) ? letter : "_"))
    .join("");
}

function getAvailableLetters(lettersGuessed: string[]) {
  const alphabet = "abcdefghijklmnopqrstuvwxyz";
  return alphabet
    .split("")
    .filter((letter) => !lettersGuessed.includes(letter))
    .join("");
}

function printGameStatus(
  secretWord: string,
  guessesLeft: number,
  lettersGuessed: string[]
) {
  console.info(
    `
I am thinking of a word that is ${secretWord.length} letters long.
${getGuessedWord(secretWord, lettersGuessed)}
You have ${guessesLeft} guess${guessesLeft === 1 ? "" : "es"} left.
Available letters: ${getAvailableLetters(lettersGuessed)}`
  );
}

function isAlpha(letter: string) {
  return /^[a-z]$/.test(letter);
}

async function getLetter(
  lettersGuessed: string[],
  warningsLeft: number,
  guessesLeft: number
) {
  let letter = "";
  let guesses = 0;
  do {
    letter = (await input("Please guess a letter: "))[0].toLowerCase();
    if (lettersGuessed.includes(letter) || !isAlpha(letter)) {
      warningsLeft = Math.max(warningsLeft - 1, 0);
      console.info(`Oops! You can only guess an available letter.`);
      console.info(
        `You have ${warningsLeft} warning${warningsLeft === 1 ? "" : "s"} left.`
      );
      guesses = warningsLeft < 1 ? guesses + 1 : guesses;
      console.info(
        warningsLeft === 0
          ? `You now have ${guessesLeft - guesses} guesses remaining.`
          : ""
      );
      if (guessesLeft == guesses) break;
    }
  } while (!isAlpha(letter) || lettersGuessed.includes(letter));

  return { letter, guesses, warningsRemaining: warningsLeft };
}

function calculateGuessesLeft(
  secretWord: string,
  letter: string,
  guessesLeft: number
) {
  const guessesToRemove = secretWord.split("").includes(letter) ? 0 : 1;
  const isVowel = "aeiou".includes(letter);

  return guessesLeft - guessesToRemove * (isVowel ? 2 : 1);
}

export async function hangman(mySecretWord?: string) {
  const secretWord = mySecretWord ?? chooseWord(loadWords());
  let guessesLeft = 6;
  let warningsLeft = 3;
  let lettersGuessed: string[] = [];

  console.info("Welcome to the game Hangman!");

  while (!isWordGuessed(secretWord, lettersGuessed) && guessesLeft > 0) {
    printGameStatus(secretWord, guessesLeft, lettersGuessed);
    const { letter, guesses, warningsRemaining } = await getLetter(
      lettersGuessed,
      warningsLeft,
      guessesLeft
    );
    warningsLeft = warningsRemaining;
    guessesLeft -= guesses;
    if (guessesLeft < 0) continue;
    lettersGuessed = [...lettersGuessed, letter];
    guessesLeft = calculateGuessesLeft(secretWord, letter, guessesLeft);
  }
  const displayText = isWordGuessed(secretWord, lettersGuessed)
    ? `You win! Your score is ${guessesLeft * new Set(secretWord).size}`
    : `You lose! The word was "${secretWord}"`;
  console.info(displayText);
}
