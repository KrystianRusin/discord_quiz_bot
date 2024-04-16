import pgPromise = require("pg-promise");
import "dotenv/config";
const pgp = pgPromise();

// TODO: Replace with your actual connection details
const connection = {
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
};

const db = pgp(connection);

export default db;
