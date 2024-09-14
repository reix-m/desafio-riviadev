const fs = require("fs");
const { bootstrap } = require("..");
const {
  getCep,
  getState,
} = require("../services/brasil-api/brasil-api-service");

jest.mock("../services/brasil-api/brasil-api-service");
jest.mock("fs");

describe("index", () => {
  describe("bootstrap", () => {
    beforeEach(() => {
      fs.writeFileSync.mockImplementation(() => {});
    });

    afterEach(() => {
      jest.resetAllMocks();
    });

    it("should handle --get-cep argument and save data to file", async () => {
      const cep = "12345-678";
      const mockData = { cep: "12345-678" };
      const parsedArgs = { "get-cep": "12345-678" };

      getCep.mockResolvedValue(mockData);

      await bootstrap(parsedArgs);

      expect(getCep).toHaveBeenCalledWith(cep);
      expect(getCep).toHaveBeenCalledTimes(1);
      expect(fs.writeFileSync).toHaveBeenCalledTimes(1);
    });
  });

  test("should handle --get-state argument and save data to file", async () => {
    const state = "SP";
    const mockData = { state: "SP", population: 12345678 };

    getState.mockResolvedValue(mockData);

    await bootstrap({ "get-state": state });

    expect(getState).toHaveBeenCalledWith(state);
    expect(getState).toHaveBeenCalledTimes(1);
    expect(fs.writeFileSync).toHaveBeenCalledTimes(1);
  });

  test("should throw an error if neither --get-cep nor --get-state is provided", () => {
    expect(() => bootstrap({})).rejects.toThrow(
      'Erro: é obrigatório passar o parâmetro --get-cep="CEP" e/ou --get-state="UF"',
    );
  });

  test("should throw an error if getCep fails", async () => {
    const cep = "12345-678";
    const errorMessage = "Network error";

    getCep.mockRejectedValue(new Error(errorMessage));

    try {
      await bootstrap({ "get-cep": cep });
    } catch (error) {
      expect(error.message).toBe(
        `Ocorreu um erro ao realizar a requisição: ${errorMessage}`,
      );
    }
  });

  test("should throw an error if getState fails", async () => {
    const state = "SP";
    const errorMessage = "Network error";

    getState.mockRejectedValue(new Error(errorMessage));

    try {
      await bootstrap({ "get-state": state });
    } catch (error) {
      expect(error.message).toBe(
        `Ocorreu um erro ao realizar a requisição: ${errorMessage}`,
      );
    }
  });
});
