/**
 * @param min included
 * @param max included
 */
import * as ReadLine from 'readline';

export const randomNumber = (min: number, max: number): number => Math.floor(Math.random() * (max - min + 1) + min);

export const validateIsraelPhoneNumber = (phoneNumber: string): boolean => {
  // This validates phone number that look like:
  // 1. 05xxxxxxxx
  // 2. +9725xxxxxxxx
  return /^05\d{8}|\+9725\d{8}$/.test(phoneNumber);
};

export async function questionPromisified(rl: ReadLine.Interface, question: string): Promise<string> {
  return await new Promise((resolve) => rl.question(question, resolve));
}

export async function questionUntilValid({
  rl,
  question,
  validateAnswer,
}: {
  rl: ReadLine.Interface;
  question: string;
  validateAnswer: (answer) => true | string;
}) {
  while (true) {
    const answer = await questionPromisified(rl, question);
    const validationResult = validateAnswer(answer);

    if (validationResult === true) {
      return answer;
    }

    console.log(validationResult);
  }
}
