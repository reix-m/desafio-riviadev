export type UseCase<TUseCasePort, TUseCaseResponse> = {
  execute(port?: TUseCasePort): Promise<TUseCaseResponse>;
};
