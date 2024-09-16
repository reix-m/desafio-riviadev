import { DataSource, QueryRunner } from 'typeorm';

interface QueryRunnerWrapper extends QueryRunner {
  releaseQueryRunner(): Promise<void>;
}

export class TransactionalTestContext {
  private queryRunner: QueryRunnerWrapper | null = null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private originQueryRunnerFunction: any;

  constructor(private readonly connection: DataSource) {}

  public async start(): Promise<void> {
    if (this.queryRunner) {
      throw new Error('Context already started');
    }

    try {
      this.queryRunner = this.buildWrappedQueryRunner();
      this.patchQueryRunnerCreation(this.queryRunner);

      await this.queryRunner.connect();
      await this.queryRunner.startTransaction();
    } catch (error) {
      await this.cleanUpResources();
      throw error;
    }
  }

  public async finish(): Promise<void> {
    if (!this.queryRunner) {
      throw new Error('Context not started. You must call "start" before finishing it.');
    }
    try {
      await this.queryRunner.rollbackTransaction();
      this.restoreQueryRunnerCreation();
    } finally {
      await this.cleanUpResources();
    }
  }

  public static new(dataSource: DataSource): TransactionalTestContext {
    return new TransactionalTestContext(dataSource);
  }

  private buildWrappedQueryRunner(): QueryRunnerWrapper {
    const originalQueryRunner = this.connection.createQueryRunner();

    const release = originalQueryRunner.release;
    originalQueryRunner.release = () => {
      return Promise.resolve();
    };

    (originalQueryRunner as QueryRunnerWrapper).releaseQueryRunner = () => {
      originalQueryRunner.release = release;
      return originalQueryRunner.release();
    };

    return originalQueryRunner as QueryRunnerWrapper;
  }

  private patchQueryRunnerCreation(queryRunner: QueryRunnerWrapper): void {
    this.originQueryRunnerFunction = DataSource.prototype.createQueryRunner;
    DataSource.prototype.createQueryRunner = () => queryRunner;
  }

  private restoreQueryRunnerCreation(): void {
    DataSource.prototype.createQueryRunner = this.originQueryRunnerFunction;
  }

  private async cleanUpResources(): Promise<void> {
    if (this.queryRunner) {
      await this.queryRunner.releaseQueryRunner();
      this.queryRunner = null;
    }
  }
}
