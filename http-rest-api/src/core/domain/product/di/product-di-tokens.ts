export class ProductDITokens {
  // Use cases
  public static readonly CreateProductUseCase: unique symbol = Symbol('CreateProductUseCase');

  public static readonly GetProductUseCase: unique symbol = Symbol('GetProductUseCase');

  public static readonly GetProductListUseCase: unique symbol = Symbol('GetProductListUseCase');

  public static readonly EditProductUseCase: unique symbol = Symbol('EditProductUseCase');

  public static readonly RemoveProductUseCase: unique symbol = Symbol('RemoveProductUseCase');

  // Repositories
  public static readonly ProductRepository: unique symbol = Symbol('ProductRepository');
}
