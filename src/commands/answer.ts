// answer.ts
import { Message } from "discord.js";
import db from "../database";
import QuizClient from "../QuizClient";

export const name = "answer";

export async function execute(message: Message, args: string[]) {
  const client = message.client as QuizClient;
  if (!client.currentQuiz) {
    message.channel.send("No quiz is currently running!");
    return;
  }

  if (message.author.id !== client.quizUser?.id) {
    message.channel.send("You are not the quiz master!");
    return;
  }

  // Fetch the correct answer from the database
  const correctAnswer = await db.one(
    "SELECT text FROM answer_choices WHERE question_id = $1 AND is_correct = TRUE",
    [client.currentQuiz.questions[client.currentQuiz.currentQuestion].id]
  );

  // Check the answer and update the score
  if (args.join(" ") === correctAnswer.text) {
    client.currentQuiz.score++;
  }

  // Move to the next question
  client.currentQuiz.currentQuestion++;

  // Check if there are more questions
  if (
    client.currentQuiz.currentQuestion < client.currentQuiz.questions.length
  ) {
    // Send the next question
    const nextQuestion =
      client.currentQuiz.questions[client.currentQuiz.currentQuestion];
    message.channel.send(
      `Next question: ${
        nextQuestion.text
      }\nAnswer choices: ${nextQuestion.answerChoices
        .map(
          (choice: { text: string }, index: number) =>
            `${index + 1}) ${choice.text}`
        )
        .join("\n")}`
    );
  } else {
    // End the quiz
    message.channel.send(
      `Quiz finished! Your score: ${client.currentQuiz.score}`
    );

    await db.none(
      "INSERT INTO user_attempts (user_id, quiz_id, score) VALUES ($1, $2, $3)",
      [client.quizUser?.id, client.currentQuiz.id, client.currentQuiz.score]
    );

    client.currentQuiz = null;
    client.quizUser = null;
  }
}

export default {
  name,
  execute,
};
