const fs = require("fs");
const path = require("path");
const { csvToJSON } = require("./transform-csv-to-json");

const INPUT_CSV_FILE = "input-data.csv";
const OUTPUT_JSON_FILE = "output-data.json";
const inputCsvFilePath = path.join(__dirname, INPUT_CSV_FILE);
const outputJsonFilePath = path.join(__dirname, OUTPUT_JSON_FILE);

const csvStream = fs.createReadStream(inputCsvFilePath, { encoding: "utf-8" });
const jsonStream = fs.createWriteStream(outputJsonFilePath, { flags: "w" });

csvToJSON(csvStream, jsonStream);

jsonStream.on("finish", () => {
  console.log(
    `Arquivo ${OUTPUT_JSON_FILE} gravado com sucesso em ${outputJsonFilePath}`,
  );
});

jsonStream.on("error", (error) => {
  console.error(
    `Ocorreu um erro ao gerar o arquivo ${OUTPUT_JSON_FILE}`,
    error,
  );
});
