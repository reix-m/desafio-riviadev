const nock = require("nock");
const { getApiData } = require("../../services/common/api");

const baseUrl = "https://brasilapi.com.br";

describe("api", () => {
  describe("getApiData", () => {
    afterEach(() => {
      nock.cleanAll();
    });

    test("should return JSON data when the request is sucessful", async () => {
      const mockData = { cep: "12345-678" };

      nock(baseUrl).get("/api/cep/v2/12345-678").reply(200, mockData);

      const url = `${baseUrl}/api/cep/v2/12345-678`;

      await expect(getApiData(url)).resolves.toEqual(mockData);
    });

    test("should return error when request fails", async () => {
      nock(baseUrl)
        .get("/api/cep/v2/12345-678")
        .replyWithError("Network Error");

      const url = `${baseUrl}/api/cep/v2/12345-678`;

      await expect(getApiData(url)).rejects.toThrow(
        "Erro na requisição: Network Error",
      );
    });

    test("should return error when the response is not valid JSON", async () => {
      nock(baseUrl).get("/api/cep/v2/12345-678").reply(200, "invalid json");

      const url = `${baseUrl}/api/cep/v2/12345-678`;

      await expect(getApiData(url)).rejects.toThrow(
        "Ocorreu um erro ao fazer o parse dos dados: Unexpected token i in JSON at position 0",
      );
    });
  });
});
