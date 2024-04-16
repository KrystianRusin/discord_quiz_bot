// QuizClient.ts
import { Client, Collection, ClientOptions, User } from "discord.js";

class QuizClient extends Client {
  commands: Collection<string, any>;
  currentQuiz: any = null;
  quizUser: User | null = null;

  constructor(options?: ClientOptions) {
    super(
      options ?? {
        intents: 32767,
      }
    );
    this.commands = new Collection();
    this.currentQuiz = null;
    this.quizUser = null;
  }
}

export default QuizClient;
