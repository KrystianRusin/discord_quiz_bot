import { Message } from "discord.js";
import db from "../database";
import QuizClient from "../QuizClient";

export const name = "startquiz";

export async function execute(message: Message, args: string[]) {
  console.log("Quiz started!");
  message.channel.send("Quiz started! Answer by tpying !answer <answer>");
  const client = message.client as QuizClient;

  // Fetch the selected quiz from the database
  const quiz = await db.one("SELECT * FROM quizzes WHERE title = $1", [
    args.join(" "),
  ]);

  // Fetch the questions for the quiz
  const questions = await db.any("SELECT * FROM questions WHERE quiz_id = $1", [
    quiz.id,
  ]);

  for (let question of questions) {
    question.answerChoices = await db.any(
      "SELECT text FROM answer_choices WHERE question_id = $1",
      [question.id]
    );
  }

  // Store the quiz, questions, and the user in the bot client
  client.currentQuiz = {
    ...quiz,
    questions,
    currentQuestion: 0,
    score: 0,
  };
  client.quizUser = message.author;

  // Send the first question and its answer choices
  const firstQuestion = questions[0];
  message.channel.send(
    `First question: ${
      firstQuestion.text
    }\nAnswer choices:\n${firstQuestion.answerChoices
      .map(
        (choice: { text: string }, index: number) =>
          `${index + 1}) ${choice.text}`
      )
      .join("\n")}`
  );
}

export default {
  name,
  execute,
};
