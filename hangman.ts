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

async function getLetter(lettersGuessed: string[]) {
  let letter = "";

  do {
    letter = (await input("Please guess a letter: "))[0].toLowerCase();
    if (lettersGuessed.includes(letter)) {
      console.info(`Oops! You've already guessed that letter`);
    }
  } while (lettersGuessed.includes(letter));

  return letter;
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
  let lettersGuessed: string[] = [];

  while (!isWordGuessed(secretWord, lettersGuessed) && guessesLeft > 0) {
    printGameStatus(secretWord, guessesLeft, lettersGuessed);
    const letter = await getLetter(lettersGuessed);
    lettersGuessed = [...lettersGuessed, letter];
    guessesLeft = calculateGuessesLeft(secretWord, letter, guessesLeft);
  }
  const displayText = isWordGuessed(secretWord, lettersGuessed)
    ? "You win!"
    : `You lose! The word was "${secretWord}"`;
  console.info(displayText);
}
