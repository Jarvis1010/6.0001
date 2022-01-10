// Problem Set 4C
import path from "path";
import fs from "fs";
import { range } from "../utils";
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
  //     def __init__(self, text):
  //         '''
  //         Initializes a SubMessage object
  //         text (string): the message's text
  //         A SubMessage object has two attributes:
  //             self.message_text (string, determined by input text)
  //             self.valid_words (list, determined using helper function load_words)
  //         '''
  //         pass #delete this line and replace with your code here
  //     def get_message_text(self):
  //         '''
  //         Used to safely access self.message_text outside of the class
  //         Returns: self.message_text
  //         '''
  //         pass #delete this line and replace with your code here
  //     def get_valid_words(self):
  //         '''
  //         Used to safely access a copy of self.valid_words outside of the class.
  //         This helps you avoid accidentally mutating class attributes.
  //         Returns: a COPY of self.valid_words
  //         '''
  //         pass #delete this line and replace with your code here
  //     def build_transpose_dict(self, vowels_permutation):
  //         '''
  //         vowels_permutation (string): a string containing a permutation of vowels (a, e, i, o, u)
  //         Creates a dictionary that can be used to apply a cipher to a letter.
  //         The dictionary maps every uppercase and lowercase letter to an
  //         uppercase and lowercase letter, respectively. Vowels are shuffled
  //         according to vowels_permutation. The first letter in vowels_permutation
  //         corresponds to a, the second to e, and so on in the order a, e, i, o, u.
  //         The consonants remain the same. The dictionary should have 52
  //         keys of all the uppercase letters and all the lowercase letters.
  //         Example: When input "eaiuo":
  //         Mapping is a->e, e->a, i->i, o->u, u->o
  //         and "Hello World!" maps to "Hallu Wurld!"
  //         Returns: a dictionary mapping a letter (string) to
  //                  another letter (string).
  //         '''
  //         pass #delete this line and replace with your code here
  //     def apply_transpose(self, transpose_dict):
  //         '''
  //         transpose_dict (dict): a transpose dictionary
  //         Returns: an encrypted version of the message text, based
  //         on the dictionary
  //         '''
  //         pass #delete this line and replace with your code here
}

export class EncryptedSubMessage extends SubMessage {
  //     def __init__(self, text):
  //         '''
  //         Initializes an EncryptedSubMessage object
  //         text (string): the encrypted message text
  //         An EncryptedSubMessage object inherits from SubMessage and has two attributes:
  //             self.message_text (string, determined by input text)
  //             self.valid_words (list, determined using helper function load_words)
  //         '''
  //         pass #delete this line and replace with your code here
  //     def decrypt_message(self):
  //         '''
  //         Attempt to decrypt the encrypted message
  //         Idea is to go through each permutation of the vowels and test it
  //         on the encrypted message. For each permutation, check how many
  //         words in the decrypted text are valid English words, and return
  //         the decrypted message with the most English words.
  //         If no good permutations are found (i.e. no permutations result in
  //         at least 1 valid word), return the original string. If there are
  //         multiple permutations that yield the maximum number of words, return any
  //         one of them.
  //         Returns: the best decrypted message
  //         Hint: use your function from Part 4A
  //         '''
  //         pass #delete this line and replace with your code here
}
// if __name__ == '__main__':

//     # Example test case
//     message = SubMessage("Hello World!")
//     permutation = "eaiuo"
//     enc_dict = message.build_transpose_dict(permutation)
//     print("Original message:", message.get_message_text(), "Permutation:", permutation)
//     print("Expected encryption:", "Hallu Wurld!")
//     print("Actual encryption:", message.apply_transpose(enc_dict))
//     enc_message = EncryptedSubMessage(message.apply_transpose(enc_dict))
//     print("Decrypted message:", enc_message.decrypt_message())

//     #TODO: WRITE YOUR TEST CASES HERE
