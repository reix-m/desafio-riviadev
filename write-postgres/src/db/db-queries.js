const pool = require("./db-connection");

async function createUsersTable() {
  const query = `
    CREATE TABLE IF NOT EXISTS public."users"(
      "id"          UUID PRIMARY KEY DEFAULT uuid_generate_v1mc(),
      "firstName"   VARCHAR(100) NULL,
      "lastName"    VARCHAR(100) NULL,
      "email"       VARCHAR(320) NULL,
      "createdAt"   TIMESTAMP
    );`;

  const res = await pool.query(query);

  return res.rows;
}

async function insertUser(userData) {
  const query = `
    INSERT INTO public."users" ("firstName", "lastName", "email", "createdAt")
    VALUES ($1, $2, $3, $4);
  `;

  const values = [
    userData.firstName,
    userData.lastName,
    userData.email,
    new Date(),
  ];

  const res = await pool.query(query, values);

  return res.rows;
}

async function getUsers() {
  const query = `
    SELECT * FROM public."users";
  `;

  const res = await pool.query(query);

  return res.rows;
}

module.exports = { createUsersTable, insertUser, getUsers };
