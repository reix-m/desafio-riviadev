const fs = require("fs");
const os = require("os");
const data = require("./data");

const headers = [
  "nome",
  "idade",
  "data_nasc",
  "sexo",
  "signo",
  "email",
  "telefone_fixo",
  "celular",
  "altura",
  "peso",
  "tipo_sanguineo",
  "cor",
];

let csvContent = [];
csvContent.push(headers.join(","));
csvContent.push(...data.map((row) => row.join(",")));
csvContent = csvContent.join(os.EOL); //line separator

fs.writeFile("data.csv", csvContent, (error) => {
  if (error) {
    console.error("Ocorreu um erro ao gerar o arquivo data.csv", error);
    return;
  }

  console.log(
    `Arquivo data.csv gravado com sucesso em ${process.cwd()}/data.csv`,
  );
});
