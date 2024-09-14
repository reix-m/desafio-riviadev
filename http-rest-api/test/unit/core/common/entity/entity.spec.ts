import { IsString } from 'class-validator';
import { randomUUID } from 'crypto';
import { Entity } from '@core/common/entity/entity';
import { Exception } from '@core/common/exception/exception';
import { Code } from '@core/common/code/code';
import { ClassValidationDetails } from '@core/common/util/class-validator/class-validator';

class MockEntity extends Entity<string> {
  @IsString()
  public name: string;

  constructor(id: string, name: string) {
    super();
    this._id = id;
    this.name = name;
  }
}

describe('Entity', () => {
  describe('getId', () => {
    test('should return id when id is set', () => {
      const id: string = randomUUID();
      const entity: MockEntity = new MockEntity(id, 'Foo');

      expect(entity.getId()).toBe(id);
    });

    test('should throw exception when id is not set', async () => {
      const id: unknown = undefined;
      const entity: MockEntity = new MockEntity(id as string, 'Foo');

      try {
        entity.getId();
      } catch (e) {
        const exception: Exception<void> = e as Exception<void>;
        expect(exception).toBeInstanceOf(Exception);
        expect(exception.code).toBe(Code.ENTITY_VALIDATION_ERROR.code);
        expect(exception.message).toBe('MockEntity: ID is empty.');
      }
    });
  });

  describe('validate', () => {
    test("should doesn't throw Exception when entity is valid", async () => {
      const validEntity: MockEntity = new MockEntity(randomUUID(), 'Foo');
      await expect(validEntity.validate()).resolves.toBeUndefined();
    });

    test('should throw Exception when entity is invalid', async () => {
      const name: unknown = 42;
      const invalidEntity: MockEntity = new MockEntity(randomUUID(), name as string);

      try {
        await invalidEntity.validate();
      } catch (e) {
        const exception: Exception<ClassValidationDetails> = e as Exception<ClassValidationDetails>;

        expect(exception).toBeInstanceOf(Exception);
        expect(exception.code).toBe(Code.ENTITY_VALIDATION_ERROR.code);
        expect(exception.data!.errors[0].property).toBe('name');
      }
    });
  });
});
