# Hello World

Criar uma função "Hello World" que executa em container

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
cd desafio-riviadev/hello-world
```

## Buildar a imagem do docker

```bash
docker build -t hello-world .
```

## Iniciar o container

```bash
docker run hello-world
```
