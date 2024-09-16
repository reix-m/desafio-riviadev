# Http Rest Api

Criar API http com aplicação e banco subindo em container

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
cd desafio-riviadev/http-rest-api
```

## Instalar dependências

```bash
npm install
# ou
yarn

```

## Executar projeto

```bash
docker compose --file docker-compose.local.yaml up -d --build
```

## Docs

[Swagger](http:localhost:3000)

### Entidades

1. User
2. Media
3. Product

### Casos de Uso

- User -> API
  1. Usuário pode criar uma conta na API
- User -> Media
  1. Usuário pode criar seus arquivos
  2. Usuários pode editar seus arquivos
  3. Usuário pode remover seus arquivos
  4. Usuário pode listar todos os arquivos
  5. Usuário pode buscar todos os arquivos
- User -> Product
  1. Usuário pode criar seus produtos
  2. Usuário pode editar seus produtos
  3. Usuário pode remover seus produtos
  4. Usuário pode listar todos os produtos
  5. Usuário pode buscar todos os produtos

## Encerar aplicação

```bash
docker compose --file docker-compose.local.yaml down
```

## Testes

Antes de iniciar os testes, verifique se a aplicação local está rodando
É recomendado encerrar o container local antes de subir o container de teste

### Iniciar containers

```bash
docker compose --file docker-compose.test.yaml up -d --build
```

### Rodar testes

```bash
npm run test
# ou
yarn test
```

### Rodar Testes com cobertura de código

```bash
npm run test:cov
# ou
yarn test:cov
```

### Encerar containers

```bash
docker compose --file docker-compose.test.yaml down
```
