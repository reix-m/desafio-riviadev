export class MediaDITokens {
  // Use cases
  public static readonly CreateMediaUseCase: unique symbol = Symbol('CreateMediaUseCase');

  // Repositories
  public static readonly MediaRepository: unique symbol = Symbol('MediaRepository');
  public static readonly MediaFileStorage: unique symbol = Symbol('MediaFileStorage');
}
