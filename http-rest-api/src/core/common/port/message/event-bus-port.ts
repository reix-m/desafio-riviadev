export type EventBusPort = {
  sendEvent<TEvent extends object>(event: TEvent): Promise<void>;
};
