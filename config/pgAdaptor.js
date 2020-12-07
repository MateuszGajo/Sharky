const { Client } = require("pg");
const { types } = require("pg");

require("dotenv").config();

types.setTypeParser(20, (val) => parseInt(val, 10));
const client = new Client({
  connectionString: process.env.DATABASE_URL || process.env.POSTGRESS_DB_URL,
  types,
});

client.connect();

module.exports = { client };
