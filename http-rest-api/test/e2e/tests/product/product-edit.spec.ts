import { Code } from '@core/common/code/code';
import { ProductCategory } from '@core/common/enums/product-enums';
import { Nullable } from '@core/common/type/common-types';
import { ProductDITokens } from '@core/domain/product/di/product-di-tokens';
import { Product } from '@core/domain/product/entity/product';
import { ProductImage } from '@core/domain/product/entity/product-image';
import { ProductOwner } from '@core/domain/product/entity/product-owner';
import { ProductRepositoryPort } from '@core/domain/product/port/persistence/product-repository-port';
import { User } from '@core/domain/user/entity/user';
import { EditProductAdapter } from '@infrastructure/adapter/usecase/product/edit-product-adapter';
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

describe('Product.Edit', () => {
  let testServer: TestServer;
  let userFixture: UserFixture;
  let mediaFixture: MediaFixture;
  let productFixture: ProductFixture;
  let productRepository: ProductRepositoryPort;
  let transactionalTestContext: TransactionalTestContext;

  beforeAll(async () => {
    testServer = await TestServer.new();

    userFixture = UserFixture.new(testServer.testingModule);
    mediaFixture = MediaFixture.new(testServer.testingModule);
    productFixture = ProductFixture.new(testServer.testingModule);

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

  describe('PUT /products/{productId}', () => {
    test('should return edited product and attaches image', async () => {
      await expectItEditProduct(testServer, productRepository, userFixture, mediaFixture, productFixture, {
        hasOriginalProductAttachedImage: false,
      });
    });

    test('should return edited product and attaches another image', async () => {
      await expectItEditProduct(testServer, productRepository, userFixture, mediaFixture, productFixture, {
        hasOriginalProductAttachedImage: true,
      });
    });

    test('should return edited product and reset image', async () => {
      await expectItEditProduct(testServer, productRepository, userFixture, mediaFixture, productFixture, {
        hasOriginalProductAttachedImage: true,
        resetImage: true,
      });
    });

    test('should return "ACCESS_DENIED_ERROR" response when user is not the owner of the product', async () => {
      const executor: User = await userFixture.insertUser({
        email: `${randomUUID()}@email.com`,
        password: randomUUID(),
      });
      const auth: { accessToken: string } = await AuthFixture.loginUser({ id: executor.getId() });

      const product: Product = await productFixture.insertProduct({
        owner: await userFixture.insertUser({ email: `${randomUUID()}@email.com`, password: randomUUID() }),
        category: ProductCategory.House,
        quantity: 10,
      });

      const response: supertest.Response = await supertest(testServer.serverApplication.getHttpServer())
        .put(`/products/${product.getId()}`)
        .set(ApiServerConfig.AccessTokenHeader, auth.accessToken)
        .expect(HttpStatus.FORBIDDEN);

      ResponseExpect.codeAndMessage(response.body, {
        code: Code.ACCESS_DENIED_ERROR.code,
        message: Code.ACCESS_DENIED_ERROR.message,
      });
      ResponseExpect.data({ response: response.body }, null);
    });

    test('should return "UNAUTHORIZED_ERROR" response when access token is not passed', async () => {
      const owner: User = await userFixture.insertUser({ email: `${randomUUID()}@email.com`, password: randomUUID() });
      const product: Product = await productFixture.insertProduct({
        owner,
        category: ProductCategory.House,
        quantity: 1,
      });

      await AuthExpect.unauthorizedError({ method: 'put', path: `/products/${product.getId()}` }, testServer);
    });

    test('should return "UNAUTHORIZED_ERROR" response when access token is not valid', async () => {
      const owner: User = await userFixture.insertUser({
        email: `${randomUUID()}@email.com`,
        password: randomUUID(),
      });
      const product: Product = await productFixture.insertProduct({
        owner,
        category: ProductCategory.House,
        quantity: 1,
      });

      await AuthExpect.unauthorizedError(
        { method: 'put', path: `/products/${product.getId()}` },
        testServer,
        randomUUID()
      );
    });

    test('should return "USE_CASE_PORT_VALIDATION_ERROR" response when request data is not valid', async () => {
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

      const response: supertest.Response = await supertest(testServer.serverApplication.getHttpServer())
        .put(`/products/${product.getId()}`)
        .send({ name: 1, description: 2, imageId: 'not-uuid', category: 3, quantity: 'a' })
        .set(ApiServerConfig.AccessTokenHeader, accessToken)
        .expect(HttpStatus.BAD_REQUEST);

      expect(response.body.data.context).toBe(EditProductAdapter.name);
      expect(response.body.data.errors.map((error: Record<string, unknown>) => error.property)).toEqual([
        'name',
        'description',
        'category',
        'imageId',
        'quantity',
      ]);

      ResponseExpect.codeAndMessage(response.body, {
        code: Code.USE_CASE_PORT_VALIDATION_ERROR.code,
        message: Code.USE_CASE_PORT_VALIDATION_ERROR.message,
      });
    });

    test('should not edit product when request data is empty', async () => {
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

      const response: supertest.Response = await supertest(testServer.serverApplication.getHttpServer())
        .put(`/products/${product.getId()}`)
        .send({ imageId: undefined })
        .set(ApiServerConfig.AccessTokenHeader, accessToken)
        .expect(HttpStatus.OK);

      const editedProduct: Nullable<Product> = await productRepository.findProduct({ id: response.body.data.id });

      const productOwner: ProductOwner = ProductFixture.userToProductOwner(executor);
      const expectedOwner: Record<string, unknown> = {
        id: productOwner.getId(),
        name: productOwner.getName(),
      };
      const expectedProductData: Record<string, unknown> = {
        id: product!.getId(),
        owner: expectedOwner,
        image: null,
        name: product.getName(),
        description: product.getDescription(),
        category: ProductCategory.House,
        quantity: product.getQuantity().getValue(),
        createdAt: product!.getCreatedAt().getTime(),
        updatedAt: product?.getUpdatedAt()?.getTime() ?? null,
      };

      expect(editedProduct).toEqual(product);

      ResponseExpect.codeAndMessage(response.body, { code: Code.SUCCESS.code, message: Code.SUCCESS.message });
      ResponseExpect.data({ response: response.body }, expectedProductData);
    });

    test('should return "ENTITY_NOT_FOUND_ERROR" response when image not found', async () => {
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

      const response: supertest.Response = await supertest(testServer.serverApplication.getHttpServer())
        .put(`/products/${product.getId()}`)
        .send({ name: randomUUID(), description: randomUUID(), imageId: randomUUID() })
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

async function expectItEditProduct(
  testServer: TestServer,
  productRepository: ProductRepositoryPort,
  userFixture: UserFixture,
  mediaFixture: MediaFixture,
  productFixture: ProductFixture,
  options?: { hasOriginalProductAttachedImage?: boolean; resetImage?: boolean }
): Promise<void> {
  const executor: User = await userFixture.insertUser({ email: `${randomUUID()}@email.com`, password: randomUUID() });
  const { accessToken } = await AuthFixture.loginUser({ id: executor.getId() });

  const product: Product = await productFixture.insertProduct({
    owner: executor,
    category: ProductCategory.House,
    quantity: 1,
    withImage: options?.hasOriginalProductAttachedImage,
  });

  const newName: string = randomUUID();
  const newDescription: string = randomUUID();
  const newCategory: ProductCategory = ProductCategory.Eletronics;
  const newQuantity: number = 10;

  const newImage: Nullable<ProductImage> = options?.resetImage
    ? null
    : ProductFixture.mediaToProductImage(await mediaFixture.insertMedia({ ownerId: executor.getId() }));

  const response: supertest.Response = await supertest(testServer.serverApplication.getHttpServer())
    .put(`/products/${product.getId()}`)
    .send({
      name: newName,
      description: newDescription,
      imageId: newImage?.getId() ?? null,
      category: newCategory,
      quantity: newQuantity,
    })
    .set(ApiServerConfig.AccessTokenHeader, accessToken)
    .expect(HttpStatus.OK);

  const editedProduct: Nullable<Product> = await productRepository.findProduct({ id: response.body.data.id });

  const expectedImage: Nullable<Record<string, unknown>> = options?.resetImage
    ? null
    : { id: newImage!.getId(), url: `${FileStorageConfig.BasePath}/${newImage!.getRelativePath()}` };

  const productOwner: ProductOwner = ProductFixture.userToProductOwner(executor);
  const expectedOwner: Record<string, unknown> = {
    id: productOwner.getId(),
    name: productOwner.getName(),
  };
  const expectedProductData: Record<string, unknown> = {
    id: editedProduct!.getId(),
    owner: expectedOwner,
    image: expectedImage,
    name: newName,
    description: newDescription,
    category: newCategory,
    quantity: newQuantity,
    createdAt: editedProduct!.getCreatedAt().getTime(),
    updatedAt: editedProduct!.getUpdatedAt()!.getTime(),
  };

  expect(editedProduct).toBeDefined();

  ResponseExpect.codeAndMessage(response.body, { code: Code.SUCCESS.code, message: Code.SUCCESS.message });
  ResponseExpect.data({ response: response.body }, expectedProductData);
}
