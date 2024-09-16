import { Code } from '@core/common/code/code';
import { ProductCategory } from '@core/common/enums/product-enums';
import { Product } from '@core/domain/product/entity/product';
import { User } from '@core/domain/user/entity/user';
import { ApiServerConfig } from '@infrastructure/config/api-server-config';
import { HttpStatus } from '@nestjs/common';
import { TestServer } from '@test/common/test-server';
import { TransactionalTestContext } from '@test/common/transactional-test-context';
import { AuthExpect } from '@test/e2e/expect/auth-expect';
import { ResponseExpect } from '@test/e2e/expect/response-expect';
import { AuthFixture } from '@test/e2e/fixture/auth-fixture';
import { ProductFixture } from '@test/e2e/fixture/product-fixture';
import { UserFixture } from '@test/e2e/fixture/user-fixture';
import { randomUUID } from 'crypto';
import supertest from 'supertest';

describe('Product.GetList', () => {
  let testServer: TestServer;
  let userFixture: UserFixture;
  let productFixture: ProductFixture;
  let transactionalTestContext: TransactionalTestContext;

  beforeAll(async () => {
    testServer = await TestServer.new();

    userFixture = UserFixture.new(testServer.testingModule);
    productFixture = ProductFixture.new(testServer.testingModule);

    await testServer.serverApplication.init();

    transactionalTestContext = TransactionalTestContext.new(testServer.dbConnection);
  });

  afterAll(async () => {
    if (testServer) {
      await testServer.serverApplication.close();
    }
  });

  beforeEach(async () => {
    await transactionalTestContext.start();
  });

  afterEach(async () => {
    await transactionalTestContext.finish();
  });

  describe('GET /products', () => {
    test('should return list of products', async () => {
      const executor: User = await userFixture.insertUser({
        email: `${randomUUID()}@email.com`,
        password: randomUUID(),
      });
      const { accessToken } = await AuthFixture.loginUser({ id: executor.getId() });

      const product: Product = await productFixture.insertProduct({
        owner: executor,
        category: ProductCategory.House,
        quantity: 1,
      });
      const otherProduct: Product = await productFixture.insertProduct({
        owner: executor,
        category: ProductCategory.Clothing,
        quantity: 100,
      });

      const response: supertest.Response = await supertest(testServer.serverApplication.getHttpServer())
        .get(`/products`)
        .set(ApiServerConfig.AccessTokenHeader, accessToken)
        .expect(HttpStatus.OK);

      const expectedProductList: Array<Record<string, unknown>> = [
        buildExpectedProductDto(otherProduct, executor),
        buildExpectedProductDto(product, executor),
      ];

      ResponseExpect.codeAndMessage(response.body, { code: Code.SUCCESS.code, message: Code.SUCCESS.message });
      ResponseExpect.data({ response: response.body }, expectedProductList);
      expect(response.body.data.length).toBe(expectedProductList.length);
    });

    test('When access token is not passed, expect it returns "UNAUTHORIZED_ERROR" response', async () => {
      await AuthExpect.unauthorizedError({ method: 'get', path: '/products' }, testServer);
    });

    test('When access token is not valid, expect it returns "UNAUTHORIZED_ERROR" response', async () => {
      await AuthExpect.unauthorizedError({ method: 'get', path: '/products' }, testServer, randomUUID());
    });
  });
});

function buildExpectedProductDto(product: Product, owner: User): Record<string, unknown> {
  const expectedOwner: Record<string, unknown> = {
    id: owner.getId(),
    name: owner.getName(),
  };
  const expectedProductData: Record<string, unknown> = {
    id: product!.getId(),
    owner: expectedOwner,
    image: null,
    name: product.getName(),
    description: product.getDescription(),
    category: product.getCategory(),
    quantity: product.getQuantity().getValue(),
    createdAt: product!.getCreatedAt().getTime(),
    updatedAt: product?.getUpdatedAt()?.getTime() ?? null,
  };

  return expectedProductData;
}
