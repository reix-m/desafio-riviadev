import { ProductCategory } from '@core/common/enums/product-enums';
import { Product } from '@core/domain/product/entity/product';
import { ProductImage } from '@core/domain/product/entity/product-image';
import { ProductOwner } from '@core/domain/product/entity/product-owner';
import { ProductUseCaseResponseDto } from '@core/domain/product/usecase/dto/product-usecase-response-dto';
import { Quantity } from '@core/domain/product/value-object/quantity';
import { randomUUID } from 'crypto';

async function createProduct(): Promise<Product> {
  return Product.new({
    owner: await ProductOwner.new(randomUUID(), randomUUID()),
    name: randomUUID(),
    description: randomUUID(),
    quantity: await Quantity.new(10),
    category: ProductCategory.House,
    image: await ProductImage.new(randomUUID(), '/relative/path'),
    updatedAt: new Date(),
  });
}

describe('ProductUseCaseResponseDto', () => {
  describe('newFromPost', () => {
    test('should create ProductUseCaseResponseDto with required parameters', async () => {
      const product: Product = await createProduct();
      const productUseCaseResponseDto: ProductUseCaseResponseDto = ProductUseCaseResponseDto.newFromProduct(product);

      expect(productUseCaseResponseDto.id).toBe(product.getId());
      expect(productUseCaseResponseDto.name).toBe(product.getName());
      expect(productUseCaseResponseDto.description).toBe(product.getDescription());
      expect(productUseCaseResponseDto.quantity).toBe(product.getQuantity().getValue());
      expect(productUseCaseResponseDto.category).toBe(product.getCategory());
      expect(productUseCaseResponseDto.owner.id).toBe(product.getOwner().getId());
      expect(productUseCaseResponseDto.owner.name).toBe(product.getOwner().getName());
      expect(productUseCaseResponseDto.image!.id).toBe(product.getImage()!.getId());
      expect(productUseCaseResponseDto.image!.url).toBe(product.getImage()!.getRelativePath());
      expect(productUseCaseResponseDto.createdAt).toBe(product.getCreatedAt().getTime());
      expect(productUseCaseResponseDto.updatedAt).toBe(product.getUpdatedAt()!.getTime());
    });
  });

  describe('newListFromProducts', () => {
    test('should create list of ProductUseCaseResponseDto with required parameters', async () => {
      const product: Product = await createProduct();
      const [productUseCaseResponseDto]: ProductUseCaseResponseDto[] = ProductUseCaseResponseDto.newListFromProducts([
        product,
      ]);

      expect(productUseCaseResponseDto.id).toBe(product.getId());
      expect(productUseCaseResponseDto.name).toBe(product.getName());
      expect(productUseCaseResponseDto.description).toBe(product.getDescription());
      expect(productUseCaseResponseDto.quantity).toBe(product.getQuantity().getValue());
      expect(productUseCaseResponseDto.category).toBe(product.getCategory());
      expect(productUseCaseResponseDto.owner.id).toBe(product.getOwner().getId());
      expect(productUseCaseResponseDto.owner.name).toBe(product.getOwner().getName());
      expect(productUseCaseResponseDto.image!.id).toBe(product.getImage()!.getId());
      expect(productUseCaseResponseDto.image!.url).toBe(product.getImage()!.getRelativePath());
      expect(productUseCaseResponseDto.createdAt).toBe(product.getCreatedAt().getTime());
      expect(productUseCaseResponseDto.updatedAt).toBe(product.getUpdatedAt()!.getTime());
    });
  });
});
