import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUsersTable1726358595372 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE public."users"(
        "id"          UUID PRIMARY KEY DEFAULT uuid_generate_v1mc(),
        "firstName"   VARCHAR(100) NULL,
        "lastName"    VARCHAR(100) NULL,
        "email"       VARCHAR(320) NULL,
        "password"    VARCHAR(200) NULL,
        "createdAt"   TIMESTAMP,
        "updatedAt"   TIMESTAMP,
        "removedAt"   TIMESTAMP
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE public."users";');
  }
}
