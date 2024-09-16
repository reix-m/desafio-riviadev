import { Nullable } from '@core/common/type/common-types';
import { User } from '@core/domain/user/entity/user';
import { UserRepositoryPort } from '@core/domain/user/port/persistence/user-repository-port';
import { Password } from '@core/domain/user/value-object/password';
import { HandleGetUserPreviewQueryService } from '@core/features/user/get-user-preview-query/handle-get-user-preview-query-service';
import { GetUserPreviewQueryHandler } from '@core/features/user/get-user-preview-query/handler/get-user-preview-query-handler';
import { GetUserPreviewQuery } from '@core/features/user/get-user-preview-query/query/get-user-preview-query';
import { GetUserPreviewQueryResult } from '@core/features/user/get-user-preview-query/result/get-user-preview-query-result';
import { createMock } from '@golevelup/ts-jest';
import { randomUUID } from 'crypto';

async function createUser(): Promise<User> {
  return User.new({
    firstName: randomUUID(),
    lastName: randomUUID(),
    email: 'author@email.com',
    password: await Password.new(randomUUID()),
  });
}

describe('HandleGetUserPreviewQueryService', () => {
  const userRepository: UserRepositoryPort = createMock<UserRepositoryPort>();
  const getUserPreviewQueryHandler: GetUserPreviewQueryHandler = new HandleGetUserPreviewQueryService(userRepository);

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('handle', () => {
    test('return user preview', async () => {
      const mockUser: User = await createUser();

      jest.spyOn(userRepository, 'findUser').mockResolvedValue(mockUser);

      const expectedPreview: GetUserPreviewQueryResult = GetUserPreviewQueryResult.new(
        mockUser.getId(),
        mockUser.getName()
      );

      const getUserPreviewQuery: GetUserPreviewQuery = { by: { id: mockUser.getId() } };
      const resultPreview: Nullable<GetUserPreviewQueryResult> =
        await getUserPreviewQueryHandler.handle(getUserPreviewQuery);

      expect(resultPreview).toEqual(expectedPreview);
    });

    test('should return nothing when user not found', async () => {
      jest.spyOn(userRepository, 'findUser').mockResolvedValue(null);

      const getUserPreviewQuery: GetUserPreviewQuery = { by: { id: randomUUID() } };
      const resultPreview: Nullable<GetUserPreviewQueryResult> =
        await getUserPreviewQueryHandler.handle(getUserPreviewQuery);

      expect(resultPreview).toBeNull();
    });
  });
});
