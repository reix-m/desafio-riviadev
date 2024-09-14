require("dotenv").config({ path: "env/local.app.env" });
const { MongoClient } = require("mongodb");

const { DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME } = process.env;

const uri = `mongodb://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}`;
let client;

async function dbConnection() {
  if (client) return client;

  client = new MongoClient(uri);
  await client.connect();

  return client.db(DB_NAME);
}

module.exports = dbConnection;
