const { Client } = require("pg");
require("dotenv").config();

const client = new Client({
  connectionString: process.env.DATABASE_URL || process.env.POSTGRESS_DB_URL,
});

client.connect();

module.exports = { client };
