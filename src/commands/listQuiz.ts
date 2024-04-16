import { Message } from "discord.js";
import db from "../database";

export const name = "listquizzes";

export async function execute(message: Message, args: string[]) {
  console.log("Listing quizzes!");

  const rows = await db.any("SELECT * FROM quizzes");

  // Check if there are any quizzes
  if (rows.length === 0) {
    message.channel.send("No quizzes available.");
    return;
  }

  // Create a string with all quiz titles, each on a new line and prefixed with a number
  const quizTitles = rows
    .map((row, index) => `${index + 1}. ${row.title}`)
    .join("\n");

  // Send the quiz titles as a message
  message.channel.send(`Here are the available quizzes:\n${quizTitles}`);
}
