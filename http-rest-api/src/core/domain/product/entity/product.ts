import { Entity } from '@core/common/entity/entity';
import { RemovableEntity } from '@core/common/entity/removable-entity';
import { ProductCategory } from '@core/common/enums/product-enums';
import { Nullable } from '@core/common/type/common-types';
import { ProductImage } from '@core/domain/product/entity/product-image';
import { ProductOwner } from '@core/domain/product/entity/product-owner';
import { CreateProductEntityPayload } from '@core/domain/product/entity/type/create-product-entity-payload';
import { Quantity } from '@core/domain/product/value-object/quantity';
import { IsDate, IsEnum, IsInstance, IsOptional, IsString } from 'class-validator';
import { randomUUID } from 'crypto';

export class Product extends Entity<string> implements RemovableEntity {
  @IsInstance(ProductOwner)
  private readonly _owner: ProductOwner;

  @IsString()
  private _name: string;

  @IsString()
  private _description: string;

  @IsEnum(ProductCategory)
  private _category: ProductCategory;

  @IsInstance(Quantity)
  private _quantity: Quantity;

  @IsOptional()
  @IsInstance(ProductImage)
  private _image: Nullable<ProductImage>;

  @IsDate()
  private readonly _createdAt: Date;

  @IsOptional()
  @IsDate()
  private _updatedAt: Nullable<Date>;

  @IsOptional()
  @IsDate()
  private _removedAt: Nullable<Date>;

  constructor(payload: CreateProductEntityPayload) {
    super();

    this._owner = payload.owner;
    this._name = payload.name;
    this._description = payload.description;
    this._category = payload.category;
    this._quantity = payload.quantity;
    this._image = payload.image ?? null;
    this._id = payload?.id ?? randomUUID();
    this._createdAt = payload?.createdAt ?? new Date();
    this._updatedAt = payload?.updatedAt ?? null;
    this._removedAt = payload?.removedAt ?? null;
  }

  public getOwner(): ProductOwner {
    return this._owner;
  }

  public getName(): string {
    return this._name;
  }

  public getDescription(): string {
    return this._description;
  }

  public getCategory(): ProductCategory {
    return this._category;
  }

  public getQuantity(): Quantity {
    return this._quantity;
  }

  public getImage(): Nullable<ProductImage> {
    return this._image;
  }

  public getCreatedAt(): Date {
    return this._createdAt;
  }

  public getUpdatedAt(): Nullable<Date> {
    return this._updatedAt;
  }

  public getRemovedAt(): Nullable<Date> {
    return this._removedAt;
  }

  public async remove(): Promise<void> {
    this._removedAt = new Date();
    await this.validate();
  }

  public static async new(payload: CreateProductEntityPayload): Promise<Product> {
    const product: Product = new Product(payload);
    await product.validate();

    return product;
  }
}
