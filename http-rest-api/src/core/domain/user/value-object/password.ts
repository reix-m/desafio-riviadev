import { ValueObject } from '@core/common/value-object/value-object';
import { IsString, MinLength } from 'class-validator';
import { pbkdf2Sync, randomBytes } from 'crypto';

export class Password extends ValueObject {
  @IsString()
  @MinLength(8)
  private readonly _value: string;

  getValue() {
    return this._value;
  }

  constructor(password: string) {
    super();
    this._value = password;
    Object.freeze(this);
  }

  private hash(): string {
    const salt = randomBytes(16).toString('hex');

    const hash = pbkdf2Sync(this.getValue(), salt, 1000, 64, 'sha512').toString('hex');

    return [salt, hash].join('$');
  }

  public compare(password: string): boolean {
    const [salt, originalHash] = this.getValue().split('$');

    const hash = pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');

    return hash === originalHash;
  }

  public static async new(value: string): Promise<Password> {
    const password = new Password(value);
    await password.validate();
    const hashedPassword = password.hash();
    return new Password(hashedPassword);
  }
}
