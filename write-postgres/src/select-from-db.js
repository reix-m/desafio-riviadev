const { getUsers } = require("./db/db-queries");

async function bootstrap() {
  const users = await getUsers();

  console.log(users);
}

bootstrap();
