const { getArgs } = require("../args");

describe("args", () => {
  describe("getArgs", () => {
    test("should parse arguments into an object", () => {
      process.argv = ["node", "index.js", "--name=Maycon", "--age=24"];
      const expectedOutput = { name: "Maycon", age: "24" };

      const result = getArgs();

      expect(result).toEqual(expectedOutput);
    });
  });
});
