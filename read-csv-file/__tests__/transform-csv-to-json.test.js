const {
  getChunkLines,
  transformToObject,
  csvToJSON,
} = require("../transform-csv-to-json");
const { Transform } = require("stream");
const fs = require("fs");

jest.mock("fs");

describe("Transform CSV to JSON", () => {
  describe("getChunkLines", () => {
    test("should split a chunk into lines", () => {
      const chunk = "name,age,city\nAlice,30,New York";
      const result = getChunkLines(chunk);
      expect(result).toEqual(["name,age,city", "Alice,30,New York"]);
    });
  });

  describe("convertToObject", () => {
    test("should transform csv row to object", () => {
      const headers = ["name", "age", "city"];
      const row = "Alice,30,New York";
      const result = transformToObject(headers, row);
      expect(result).toEqual({
        name: "Alice",
        age: "30",
        city: "New York",
      });
    });
  });

  describe("csvToJSON", () => {
    let mockCsvStream, mockJsonStream;

    beforeEach(() => {
      mockCsvStream = new Transform({
        readableObjectMode: true,
        transform(chunk, encoding, cb) {
          cb(null, chunk);
        },
      });

      mockJsonStream = new Transform({
        writableObjectMode: true,
        transform(chunk, encoding, cb) {
          cb();
        },
      });

      fs.createReadStream.mockReturnValue(mockCsvStream);
      fs.createWriteStream.mockReturnValue(mockJsonStream);
    });

    test("should transform csv into json format", (done) => {
      const inputCsv = "name,age,city\nAlice,30,New York\nBob,25,Los Angeles";
      const expectedJson = [
        { name: "Alice", age: "30", city: "New York" },
        { name: "Bob", age: "25", city: "Los Angeles" },
      ];

      let jsonData = "";
      mockJsonStream._transform = (chunk, encoding, cb) => {
        jsonData += chunk.toString();
        cb();
      };

      csvToJSON(mockCsvStream, mockJsonStream);

      mockCsvStream.push(inputCsv);
      mockCsvStream.end();

      mockJsonStream.on("finish", () => {
        const parsedJson = JSON.parse(jsonData);
        expect(parsedJson).toEqual(expectedJson);
        done();
      });
    });
  });
});
