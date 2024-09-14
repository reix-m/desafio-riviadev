const https = require("https");

function getApiData(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (response) => {
        let data = "";

        response.on("data", (chunk) => {
          data += chunk;
        });

        response.on("end", () => {
          try {
            const parsedData = JSON.parse(data);
            resolve(parsedData);
          } catch (error) {
            reject(
              new Error(
                `Ocorreu um erro ao fazer o parse dos dados: ${error.message}`,
              ),
            );
          }
        });
      })
      .on("error", (error) => {
        reject(new Error(`Erro na requisição: ${error.message}`));
      });
  });
}

module.exports = {
  getApiData,
};
