import { UseCase } from '@core/common/usecase/usecase';

export type TransactionalUseCase<TUseCasePort, TUseCaseResult> = UseCase<TUseCasePort, TUseCaseResult> & {
  onCommit?: (result: TUseCaseResult, port: TUseCasePort) => Promise<void>;
  onRollback?: (error: Error, port: TUseCasePort) => Promise<void>;
};
