const url = require("url");
const http = require("http");
const { userCollection } = require("./db/db-queries");

async function getReqBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", () => {
      try {
        resolve(JSON.parse(body));
      } catch (error) {
        reject("Invalid JSON");
      }
    });

    req.on("error", (error) => {
      reject(error);
    });
  });
}

async function postUser(body, res) {
  console.log(body);
  if (!body?.firstName) {
    res.writeHead(400);
    res.end(JSON.stringify({ error: "O campo 'firstName' é obrigatório." }));
    return;
  }

  if (!body?.lastName) {
    res.writeHead(400);
    res.end(JSON.stringify({ error: "O campo 'lastName' é obrigatório." }));
    return;
  }

  const userData = {
    firstName: body.firstName,
    lastName: body.lastName,
  };

  const { insertUser } = await userCollection();
  await insertUser(userData);

  res.writeHead(201);
  res.end();
}

async function listUsers(res) {
  const { getUsers } = await userCollection();
  const users = await getUsers();

  res.writeHead(200);
  res.end(JSON.stringify(users));
}

async function handleRequest(req, res) {
  const parsedUrl = url.parse(req.url, true);

  res.setHeader("Content-Type", "application/json");

  if (parsedUrl.pathname === "/users" && req.method === "POST") {
    const body = await getReqBody(req);
    await postUser(body, res);
  } else if (parsedUrl.pathname === "/users" && req.method === "GET") {
    await listUsers(res);
  } else {
    res.writeHead(404);
    res.end(JSON.stringify({ error: "Rota não encontrada" }));
  }
}

async function bootstrap() {
  const server = http.createServer(handleRequest);

  const PORT = 3000;
  server.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
  });
}

bootstrap();
