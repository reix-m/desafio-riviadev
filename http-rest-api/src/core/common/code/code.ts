export type CodeDescription = {
  code: number;
  message: string;
};

export class Code {
  public static SUCCESS: CodeDescription = {
    code: 200,
    message: 'Success.',
  };

  public static BAD_REQUEST_ERROR: CodeDescription = {
    code: 400,
    message: 'Bad request.',
  };

  public static INTERNAL_ERROR: CodeDescription = {
    code: 500,
    message: 'Internal error.',
  };

  public static ENTITY_VALIDATION_ERROR: CodeDescription = {
    code: 1000,
    message: 'Entity object validation error.',
  };

  public static VALUE_OBJECT_VALIDATION_ERROR: CodeDescription = {
    code: 1001,
    message: 'Value object validation error.',
  };

  public static ENTITY_ALREADY_EXISTS_ERROR: CodeDescription = {
    code: 1002,
    message: 'Entity already exists error.',
  };
}
