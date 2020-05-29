const pgPromise = require("pg-promise");
const env = require("dotenv").config();
console.log(process.env.POSTGRES_HOST);

const pgp = pgPromise({});

const config = {
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT,
  database: process.env.POSTGRES_DB,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
};

const db = pgp(config);

module.exports = { db };
