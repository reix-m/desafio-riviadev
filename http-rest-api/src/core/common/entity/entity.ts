import { Code } from '@core/common/code/code';
import { Exception } from '@core/common/exception/exception';
import { Optional } from '@core/common/type/common-types';
import { ClassValidationDetails, ClassValidator } from '@core/common/util/class-validator/class-validator';

export abstract class Entity<TIdentifier extends string | number> {
  protected _id: Optional<TIdentifier>;

  public getId(): TIdentifier {
    if (typeof this._id === 'undefined') {
      throw Exception.new({
        code: Code.ENTITY_VALIDATION_ERROR,
        overrideMessage: `${this.constructor.name}: ID is empty.`,
      });
    }

    return this._id;
  }

  public async validate(): Promise<void> {
    const details: Optional<ClassValidationDetails> = await ClassValidator.validate(this);
    if (details) {
      throw Exception.new({
        code: Code.ENTITY_VALIDATION_ERROR,
        data: details,
      });
    }
  }
}
