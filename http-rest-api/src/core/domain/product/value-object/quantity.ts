import { ValueObject } from '@core/common/value-object/value-object';
import { IsNumber, Min } from 'class-validator';

export class Quantity extends ValueObject {
  @IsNumber()
  @Min(0)
  private readonly _value: number;

  constructor(value: number) {
    super();

    this._value = value;

    Object.freeze(this);
  }

  public getValue() {
    return this._value;
  }

  public static async new(value: number): Promise<Quantity> {
    const quantity: Quantity = new Quantity(value);
    await quantity.validate();

    return quantity;
  }
}
