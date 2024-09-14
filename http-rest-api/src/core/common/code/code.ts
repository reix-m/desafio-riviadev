export type CodeDescription = {
  code: number;
  message: string;
};

export class Code {
  public static BAD_REQUEST_ERROR: CodeDescription = {
    code: 400,
    message: 'Bad request.',
  };

  public static ENTITY_VALIDATION_ERROR: CodeDescription = {
    code: 1000,
    message: 'Entity object validation error.',
  };
}
