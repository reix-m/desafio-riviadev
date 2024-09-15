import { Entity } from '@core/common/entity/entity';
import { IsString } from 'class-validator';

export class ProductImage extends Entity<string> {
  @IsString()
  private readonly _relativePath: string;

  constructor(id: string, relativePath: string) {
    super();

    this._id = id;
    this._relativePath = relativePath;

    Object.freeze(this);
  }

  public getRelativePath(): string {
    return this._relativePath;
  }

  public static async new(id: string, relativePath: string): Promise<ProductImage> {
    const productImage: ProductImage = new ProductImage(id, relativePath);
    await productImage.validate();

    return productImage;
  }
}
