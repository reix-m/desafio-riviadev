const {
  getCep,
  getState,
} = require("../../services/brasil-api/brasil-api-service");
const { getApiData } = require("../../services/common/api");

jest.mock("../../services/common/api");

describe("brasil-api-service", () => {
  describe("getCep", () => {
    afterEach(() => {
      jest.resetAllMocks();
    });

    test("should return data when api request is successful", async () => {
      const mockData = { cep: "12345-678" };
      getApiData.mockResolvedValue(mockData);

      const cep = "12345-678";
      const data = await getCep(cep);

      expect(data).toEqual(mockData);
      expect(getApiData).toHaveBeenCalledWith(
        `https://brasilapi.com.br/api/cep/v2/${cep}`,
      );
      expect(getApiData).toHaveBeenCalledTimes(1);
    });

    test("should throw an error when api request fails", async () => {
      const errorMessage = "Network error";
      getApiData.mockRejectedValue(new Error(errorMessage));

      const cep = "12345-678";

      await expect(getCep(cep)).rejects.toThrow(
        `Ocorreu um erro ao realizar a requisição: ${errorMessage}`,
      );
      expect(getApiData).toHaveBeenCalledWith(
        `https://brasilapi.com.br/api/cep/v2/${cep}`,
      );
      expect(getApiData).toHaveBeenCalledTimes(1);
    });
  });

  describe("getState", () => {
    afterEach(() => {
      jest.resetAllMocks();
    });

    test("should return data when api request is successful", async () => {
      const mockData = { state: "São Paulo" };
      getApiData.mockResolvedValue(mockData);

      const uf = "SP";
      const data = await getState(uf);

      expect(data).toEqual(mockData);
      expect(getApiData).toHaveBeenCalledWith(
        `https://brasilapi.com.br/api/ibge/uf/v1/${uf}`,
      );
      expect(getApiData).toHaveBeenCalledTimes(1);
    });

    test("should throw an error when api request fails", async () => {
      const errorMessage = "Network error";
      getApiData.mockRejectedValue(new Error(errorMessage));

      const uf = "SP";

      await expect(getState(uf)).rejects.toThrow(
        `Ocorreu um erro ao realizar a requisição: ${errorMessage}`,
      );
      expect(getApiData).toHaveBeenCalledWith(
        `https://brasilapi.com.br/api/ibge/uf/v1/${uf}`,
      );
      expect(getApiData).toHaveBeenCalledTimes(1);
    });
  });
});
