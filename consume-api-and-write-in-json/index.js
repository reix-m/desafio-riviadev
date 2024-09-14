const { getArgs } = require("./args");
const {
  getCep,
  getState,
} = require("./services/brasil-api/brasil-api-service");
const path = require("path");
const fs = require("fs");

function writeFile(outputFilePath, data) {
  fs.writeFileSync(outputFilePath, JSON.stringify(data, null, 2), "utf8");
  console.log(`Arquivo ${outputFilePath} salvo com sucesso!`);
}

function handleCepArg(cep) {
  getCep(cep)
    .then((data) => {
      const outputFilePath = path.join(__dirname, `output/get-cep-${cep}.json`);
      writeFile(outputFilePath, data);
    })
    .catch((error) => {
      console.error(error);
    });
}

function handleStateArg(state) {
  getState(state)
    .then((data) => {
      const outputFilePath = path.join(
        __dirname,
        `output/get-state-${state}.json`,
      );
      writeFile(outputFilePath, data);
    })
    .catch((error) => {
      console.error(error);
    });
}

async function bootstrap(parsedArgs) {
  const { "get-cep": cep, "get-state": state } = parsedArgs;

  if (!(cep || state)) {
    throw new Error(
      'Erro: é obrigatório passar o parâmetro --get-cep="CEP" e/ou --get-state="UF"',
    );
  }

  if (cep) {
    handleCepArg(cep);
  }

  if (state) {
    handleStateArg(state);
  }
}

if (require.main === module) {
  const parsedArgs = getArgs();
  bootstrap(parsedArgs);
}

module.exports = {
  bootstrap,
};
