const { getApiData } = require("../common/api");

const baseUrl = "https://brasilapi.com.br";

async function getCep(cep) {
  const url = `${baseUrl}/api/cep/v2/${cep}`;

  return getApiData(url)
    .then((data) => {
      return data;
    })
    .catch((error) => {
      throw new Error(
        `Ocorreu um erro ao realizar a requisição: ${error.message}`,
      );
    });
}

async function getState(uf) {
  const url = `${baseUrl}/api/ibge/uf/v1/${uf}`;

  return getApiData(url)
    .then((data) => {
      return data;
    })
    .catch((error) => {
      throw new Error(
        `Ocorreu um erro ao realizar a requisição: ${error.message}`,
      );
    });
}

module.exports = {
  getCep,
  getState,
};
