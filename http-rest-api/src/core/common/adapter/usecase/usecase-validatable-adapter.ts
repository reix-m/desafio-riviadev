import { Code } from '@core/common/code/code';
import { Exception } from '@core/common/exception/exception';
import { Optional } from '@core/common/type/common-types';
import { ClassValidationDetails, ClassValidator } from '@core/common/util/class-validator/class-validator';

export class UseCaseValidatableAdapter {
  public async validate(): Promise<void> {
    const details: Optional<ClassValidationDetails> = await ClassValidator.validate(this);
    if (details) {
      throw Exception.new({ code: Code.USE_CASE_PORT_VALIDATION_ERROR, data: details });
    }
  }
}
