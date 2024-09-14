# Consumir API e escrever em um arquivo JSON

Criar uma lógica que consome de uma API (dos correios, por exemplo)
e escreve em um arquivo json

## Pré-requisitos

- [Node.js](https://nodejs.org/) (versão 18.20.2)
- [NPM](https://www.npmjs.com/) ou [Yarn](https://yarnpkg.com/)

## Instalação

### 1. Clonar o repositório

```bash
git clone https://github.com/mayconreis/desafio-riviadev.git
```

### 2. Entrar no diretório do projeto

```bash
cd desafio-riviadev/consume-api-and-write-in-json
```

## Instalar dependências

```bash
npm install
# ou
yarn
```

## Executar projeto

### Usando NPM

```bash
npm start -- --get-cep="CEP"
# ou
npm start -- --get-state="UF"
```

### Usando Yarn

```bash
yarn start
```

## Exemplo

```bash
npm start -- --get-cep="01153-000" --get-state="SP"
```

## Saída

Os arquivos com os dados retornados pela API podem ser encontrados na pasta output

## Testes

### Para rodar os testes unitários

```bash
npm run test
# ou
yarn test

```

### Para rodar os testes com cobertura de código

```bash
npm run test:cov
# ou
yarn test:cov
```
