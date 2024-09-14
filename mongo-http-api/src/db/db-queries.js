const dbConnection = require("./db-connection");

const USERS_COLLECTION = "users";
let collection;

async function userCollection() {
  if (!collection) {
    const db = await dbConnection();
    collection = await db.collection(USERS_COLLECTION);
  }

  return {
    insertUser: async (userData) => collection.insertOne(userData),
    getUsers: async () => collection.find().toArray(),
  };
}

module.exports = { userCollection };
