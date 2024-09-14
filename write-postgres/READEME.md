# Inserir no banco de dados Postgres

Criar um lógica simples que escreve em um banco de dados SQL (postgres)

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
cd desafio-riviadev/write-postgres
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

## Listar o registros inseridos

```bash
npm run list-data
# ou
yarn list-data
```

## Encerar o banco de dados

```bash
docker compose down
```
