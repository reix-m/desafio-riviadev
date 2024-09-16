import { Code } from '@core/common/code/code';
import { ProductCategory } from '@core/common/enums/product-enums';
import { Nullable } from '@core/common/type/common-types';
import { ProductDITokens } from '@core/domain/product/di/product-di-tokens';
import { Product } from '@core/domain/product/entity/product';
import { ProductImage } from '@core/domain/product/entity/product-image';
import { ProductOwner } from '@core/domain/product/entity/product-owner';
import { ProductRepositoryPort } from '@core/domain/product/port/persistence/product-repository-port';
import { User } from '@core/domain/user/entity/user';
import { CreateProductAdapter } from '@infrastructure/adapter/usecase/product/create-product-adapter';
import { ApiServerConfig } from '@infrastructure/config/api-server-config';
import { FileStorageConfig } from '@infrastructure/config/file-storage-config';
import { HttpStatus } from '@nestjs/common';
import { TestServer } from '@test/common/test-server';
import { TransactionalTestContext } from '@test/common/transactional-test-context';
import { AuthExpect } from '@test/e2e/expect/auth-expect';
import { ResponseExpect } from '@test/e2e/expect/response-expect';
import { AuthFixture } from '@test/e2e/fixture/auth-fixture';
import { MediaFixture } from '@test/e2e/fixture/media-fixture';
import { ProductFixture } from '@test/e2e/fixture/product-fixture';
import { UserFixture } from '@test/e2e/fixture/user-fixture';
import { randomUUID } from 'crypto';
import supertest from 'supertest';

describe('Product.Create', () => {
  let testServer: TestServer;
  let userFixture: UserFixture;
  let mediaFixture: MediaFixture;
  let productRepository: ProductRepositoryPort;
  let transactionalTestContext: TransactionalTestContext;

  beforeAll(async () => {
    testServer = await TestServer.new();

    userFixture = UserFixture.new(testServer.testingModule);
    mediaFixture = MediaFixture.new(testServer.testingModule);

    productRepository = testServer.testingModule.get(ProductDITokens.ProductRepository);

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

  describe('POST /products', () => {
    test('should create product with image', async () => {
      await expectItCreatesProduct(testServer, productRepository, userFixture, mediaFixture, { withImage: true });
    });

    test('should create product without image', async () => {
      await expectItCreatesProduct(testServer, productRepository, userFixture, mediaFixture);
    });

    test('should return "UNAUTHORIZED_ERROR" response when access token is not passed', async () => {
      await AuthExpect.unauthorizedError({ method: 'post', path: '/products' }, testServer);
    });

    test('should return "UNAUTHORIZED_ERROR" response when access token is not valid', async () => {
      await AuthExpect.unauthorizedError({ method: 'post', path: '/products' }, testServer, randomUUID());
    });

    test('should return "USE_CASE_PORT_VALIDATION_ERROR" response when request data is not valid', async () => {
      const executor: User = await userFixture.insertUser({
        email: `${randomUUID()}@email.com`,
        password: randomUUID(),
      });
      const { accessToken } = await AuthFixture.loginUser({ id: executor.getId() });

      const response: supertest.Response = await supertest(testServer.serverApplication.getHttpServer())
        .post('/products')
        .send({ name: 42, description: 42, category: 2, quantity: 'abc', imageId: 'not-uuid' })
        .set(ApiServerConfig.AccessTokenHeader, accessToken)
        .expect(HttpStatus.BAD_REQUEST);

      expect(response.body.data.context).toBe(CreateProductAdapter.name);
      expect(response.body.data.errors.map((error: Record<string, unknown>) => error.property)).toEqual([
        'name',
        'description',
        'category',
        'quantity',
        'imageId',
      ]);

      ResponseExpect.codeAndMessage(response.body, {
        code: Code.USE_CASE_PORT_VALIDATION_ERROR.code,
        message: Code.USE_CASE_PORT_VALIDATION_ERROR.message,
      });
    });

    test('should return "ENTITY_NOT_FOUND_ERROR" response when image not found', async () => {
      const executor: User = await userFixture.insertUser({
        email: `${randomUUID()}@email.com`,
        password: randomUUID(),
      });

      const { accessToken } = await AuthFixture.loginUser({ id: executor.getId() });

      const response: supertest.Response = await supertest(testServer.serverApplication.getHttpServer())
        .post('/products')
        .send({
          name: randomUUID(),
          description: randomUUID(),
          imageId: randomUUID(),
          category: ProductCategory.House,
          quantity: 10,
        })
        .set(ApiServerConfig.AccessTokenHeader, accessToken)
        .expect(HttpStatus.BAD_REQUEST);

      ResponseExpect.codeAndMessage(response.body, {
        code: Code.ENTITY_NOT_FOUND_ERROR.code,
        message: 'Product image not found.',
      });
      ResponseExpect.data({ response: response.body }, null);
    });
  });
});

async function expectItCreatesProduct(
  testServer: TestServer,
  productRepository: ProductRepositoryPort,
  userFixture: UserFixture,
  mediaFixture: MediaFixture,
  options?: { withImage?: boolean }
): Promise<void> {
  const executor: User = await userFixture.insertUser({ email: `${randomUUID()}@email.com`, password: randomUUID() });
  const { accessToken } = await AuthFixture.loginUser({ id: executor.getId() });

  const productName: string = randomUUID();
  const productDescription: string = randomUUID();
  const productCategory: ProductCategory = ProductCategory.House;
  const productQuantity: number = 10;

  const productImage: Nullable<ProductImage> = options?.withImage
    ? ProductFixture.mediaToProductImage(await mediaFixture.insertMedia({ ownerId: executor.getId() }))
    : null;

  const response: supertest.Response = await supertest(testServer.serverApplication.getHttpServer())
    .post('/products')
    .send({
      name: productName,
      description: productDescription,
      category: productCategory,
      quantity: productQuantity,
      imageId: productImage?.getId(),
    })
    .set(ApiServerConfig.AccessTokenHeader, accessToken)
    .expect(HttpStatus.CREATED);

  const createdProduct: Nullable<Product> = await productRepository.findProduct({ id: response.body.data.id });

  const expectedImage: Nullable<Record<string, unknown>> = options?.withImage
    ? { id: productImage!.getId(), url: `${FileStorageConfig.BasePath}/${productImage!.getRelativePath()}` }
    : null;

  const productOwner: ProductOwner = ProductFixture.userToProductOwner(executor);
  const expectedOwner: Record<string, unknown> = {
    id: productOwner.getId(),
    name: productOwner.getName(),
  };

  const expectedProductData: Record<string, unknown> = {
    id: createdProduct!.getId(),
    owner: expectedOwner,
    image: expectedImage,
    name: productName,
    description: productDescription,
    category: productCategory,
    quantity: productQuantity,
    createdAt: createdProduct!.getCreatedAt().getTime(),
    updatedAt: null,
  };

  expect(createdProduct).toBeDefined();

  ResponseExpect.codeAndMessage(response.body, { code: Code.CREATED.code, message: Code.CREATED.message });
  ResponseExpect.data({ response: response.body }, expectedProductData);
}
