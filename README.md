# discord_quiz_bot

A Discord Quiz bot that allows users to start a quiz and answer questions, their score is then stored in a PostgresSQL database 

## Tools Used:
- Typescript
- DiscordJs
- PostgresSQL

## Currently Supported Commands

### !startQuiz <quizname>:
  - Starts a quiz using the quiz name provided with the user who used the start quiz command
  - Quiz goes through all questions related to that quiz name in the database prompting the user to choose an answer
  - Once all questions are answered, the users score is displayed and stored in the database

### !answer <answer>:
  - Used by the user to submit a final answer for each question
  - After !answer command is used, the bot moves onto next question

### !listQuiz:
  - Used by the user to see all available Quiz names that are stored in the database 


## Usage (local):

To use locally a PostgreSQL database and .env file must be conifgured prior to running npm run start command in root directory
 
### Database Setup

```
-- Tables

CREATE TABLE quizzes (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE questions (
  id SERIAL PRIMARY KEY,
  quiz_id INTEGER NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  type VARCHAR(20) NOT NULL DEFAULT 'multiple_choice', -- or 'open_ended'
  CONSTRAINT unique_question_per_quiz UNIQUE (quiz_id, text)
);

CREATE TABLE answer_choices (
  id SERIAL PRIMARY KEY,
  question_id INTEGER NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  is_correct BOOLEAN DEFAULT FALSE,
  CONSTRAINT unique_choice_per_question UNIQUE (question_id, text)
);

CREATE TABLE user_attempts (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL, -- Discord user ID
  quiz_id INTEGER NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
  score INTEGER,
  completed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

### .ENV Setup:

- TOKEN = <discord bot token retrieved from discord developer portal
- DB_HOST = `<DB host name (generally localhost if running locally)>`
- DB_POST = `<PostgreSQL server port (default is 5432)>`
- DB_NAME = `<Database name>`
- DB_USER = `<Username of user with database access>`
- DB_PASS = `<Password for user>`

## Features to be implemented:

- Leaderboard system to track fastest time to complete quiz
- Cancelling quiz
- Admin dashboard website which allows admin of bot to add/delete quizzes
