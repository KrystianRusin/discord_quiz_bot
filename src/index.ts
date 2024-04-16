// Import necessary modules
import "dotenv/config";
import * as fs from "fs";
import * as path from "path";
import QuizClient from "./QuizClient";
import { Message } from "discord.js";

const client = new QuizClient({
  intents: ["Guilds", "GuildMessages", "GuildMembers", "MessageContent"],
});

const commandFiles = fs
  .readdirSync(path.join(__dirname, "commands"))
  .filter((file) => file.endsWith(".ts"));

// Wrap command loading in an async function
async function loadCommands() {
  for (const file of commandFiles) {
    const command = await import(`./commands/${file}`);
    client.commands.set(command.name, command);
  }
}

// Call the loadCommands function
loadCommands();

client.on("ready", () => {
  console.log(`${client.user?.username} is ready!`);
});

client.on("messageCreate", (message: Message) => {
  if (message.author.bot || !message.guild) return;
  const prefix = "!";
  if (!message.content.startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const commandName = args.shift()?.toLowerCase();

  if (!commandName) return;

  const command = client.commands.get(commandName);

  if (!command) return;

  try {
    command.execute(message, args);
  } catch (error) {
    console.error(error);
    message.reply("There was an error trying to execute that command!");
  }
});

client.login(process.env.TOKEN);
