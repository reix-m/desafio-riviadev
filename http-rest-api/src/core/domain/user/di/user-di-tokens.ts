export class UserDITokens {
  // Use cases
  public static readonly SignUpUseCase: unique symbol = Symbol('SignUpUseCase');

  // Repositories
  public static readonly UserRepository: unique symbol = Symbol('UserRepository');

  // Handlers
  public static readonly GetUserPreviewQueryHandler: unique symbol = Symbol('GetUserPreviewQueryHandler');
}
