import { getStoryString, CiphertextMessage } from "./ps4b";

const story = getStoryString();

const ciphertext = new CiphertextMessage(story);

console.log(ciphertext.decryptMessage());
