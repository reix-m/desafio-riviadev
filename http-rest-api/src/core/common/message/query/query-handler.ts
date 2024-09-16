export type QueryHandler<TQuery, TQueryResult> = {
  handle(query: TQuery): Promise<TQueryResult>;
};
