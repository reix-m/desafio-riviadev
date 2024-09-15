import { HttpRestApiModelSignUpBody } from '@application/api/http-rest/controller/documentation/user/http-rest-api-model-sign-up-body';
import { HttpRestApiResponseUser } from '@application/api/http-rest/controller/documentation/user/http-rest-api-response-user';
import { CoreApiResponse } from '@core/common/api/core-api-response';
import { Code } from '@core/common/code/code';
import { UserDITokens } from '@core/domain/user/di/user-di-tokens';
import { UserUseCaseResponseDto } from '@core/domain/user/usecase/dto/user-usecase-response-dto';
import { SignUpUseCase } from '@core/features/user/sign-up/usecase/sign-up-usecase';
import { SignUpAdapter } from '@infrastructure/adapter/usecase/user/sign-up-adapter';
import { Body, Controller, HttpCode, HttpStatus, Inject, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('users')
@ApiTags('users')
export class UserController {
  constructor(@Inject(UserDITokens.SignUpUseCase) private readonly SignUpUseCase: SignUpUseCase) {}

  @Post('sign-up')
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @ApiBody({ type: HttpRestApiModelSignUpBody })
  @ApiResponse({ status: HttpStatus.CREATED, type: HttpRestApiResponseUser })
  public async signUp(@Body() body: HttpRestApiModelSignUpBody): Promise<CoreApiResponse<UserUseCaseResponseDto>> {
    const adapter: SignUpAdapter = await SignUpAdapter.new({
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      password: body.password,
    });

    const signedUser: UserUseCaseResponseDto = await this.SignUpUseCase.execute(adapter);

    return CoreApiResponse.success(Code.CREATED.code, signedUser, Code.CREATED.message);
  }
}
