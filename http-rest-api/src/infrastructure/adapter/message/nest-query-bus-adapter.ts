import { QueryBusPort } from '@core/common/port/message/query-bus-port';
import { Injectable } from '@nestjs/common';
import { IQuery, QueryBus } from '@nestjs/cqrs';

@Injectable()
export class NestQueryBusAdapter implements QueryBusPort {
  constructor(readonly queryBus: QueryBus) {}

  public async sendQuery<TQuery, TQueryResult>(query: TQuery): Promise<TQueryResult> {
    return this.queryBus.execute(query as IQuery);
  }
}
