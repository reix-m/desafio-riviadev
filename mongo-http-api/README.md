# Mongo Http API

Criar uma lógica que escreve em um banco de dados NoSQL (dynamodb, mongo)

## Pré-requisitos

- [Node.js](https://nodejs.org/) (versão 18.20.2)
- [NPM](https://www.npmjs.com/) ou [Yarn](https://yarnpkg.com/)
- [Docker](https://www.docker.com/)

## Instalação

### 1. Clonar o repositório

```bash
git clone https://github.com/mayconreis/desafio-riviadev.git
```

### 2. Entrar no diretório do projeto

```bash
cd desafio-riviadev/mongo-http-api
```

## Instalar dependências

```bash
npm install
# ou
yarn
```

## Iniciar o banco de dados

```bash
docker compose up -d
```

## Executar projeto

### Usando NPM

```bash
npm start
```

### Usando Yarn

```bash
yarn start
```

## Endpoints

### Inserir usuário

```bash
# CURL
curl --location 'localhost:3000/users' \
--header 'Content-Type: application/json' \
--data '{
    "firstName": "Foo",
    "lastName": "Bar"
}'
```

### Listar usuários

```bash
# CURL
curl --location 'localhost:3000/users'
```

## Encerar o banco de dados

```bash
docker compose down
```
