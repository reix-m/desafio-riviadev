import { Entity } from '@core/common/entity/entity';
import { IsString } from 'class-validator';

export class ProductOwner extends Entity<string> {
  @IsString()
  private readonly _name: string;

  constructor(id: string, name: string) {
    super();

    this._id = id;
    this._name = name;

    Object.freeze(this);
  }

  public getName(): string {
    return this._name;
  }

  public static async new(id: string, name: string): Promise<ProductOwner> {
    const productOwner: ProductOwner = new ProductOwner(id, name);
    await productOwner.validate();

    return productOwner;
  }
}
