const { faker } = require("@faker-js/faker");
const { insertUser, createUsersTable } = require("./db/db-queries");

async function bootstrap() {
  await createUsersTable();

  const userData = {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
  };

  await insertUser(userData);

  console.log("Registro inserido com sucesso!");
}

bootstrap();
