const { Client } = require("pg");
const types = require('pg').types
require("dotenv").config();

types.setTypeParser(20, function(val) {
  return parseInt(val)
})
const client = new Client({
  connectionString: process.env.DATABASE_URL || process.env.POSTGRESS_DB_URL,
  types
});

client.connect();

module.exports = { client };
