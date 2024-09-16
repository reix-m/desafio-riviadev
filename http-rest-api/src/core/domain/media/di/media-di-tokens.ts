export class MediaDITokens {
  // Use cases
  public static readonly CreateMediaUseCase: unique symbol = Symbol('CreateMediaUseCase');

  public static readonly GetMediaUseCase: unique symbol = Symbol('GetMediaUseCase');

  public static readonly EditMediaUseCase: unique symbol = Symbol('EditMediaUseCase');

  // Repositories
  public static readonly MediaRepository: unique symbol = Symbol('MediaRepository');

  public static readonly MediaFileStorage: unique symbol = Symbol('MediaFileStorage');
}
