const fs = require("fs");
const path = require("path");
const { Transform } = require("stream");

function getChunkLines(chunk) {
  const chunkStr = chunk.toString();

  const lines = chunkStr.split("\n");

  return lines.filter((line) => line.trim() !== "");
}

function transformToObject(headers, row, delimiter = ",") {
  const values = row.split(delimiter);

  const rowObject = headers.reduce((obj, header, index) => {
    obj[header] = values[index];
    return obj;
  }, {});

  return rowObject;
}

function csvToJSON(csvStream, jsonStream, delimiter = ",") {
  let headers = [];
  let isFirstObject = true;

  const transformStream = new Transform({
    readableObjectMode: true,
    transform(chunk, encoding, cb) {
      const lines = getChunkLines(chunk);

      if (!headers.length) {
        headers = lines.shift().split(delimiter);
        jsonStream.write("["); // start json array
      }

      lines.forEach((line) => {
        const jsonObject = transformToObject(headers, line, delimiter);

        if (!isFirstObject) {
          jsonStream.write(","); // add comma before the next if it is not first object
        }

        jsonStream.write(JSON.stringify(jsonObject, null, 2) + "\n");
        isFirstObject = false;
      });

      cb();
    },
    flush(cb) {
      jsonStream.end("]");

      cb();
    },
  });

  csvStream.pipe(transformStream).pipe(jsonStream);
}

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
