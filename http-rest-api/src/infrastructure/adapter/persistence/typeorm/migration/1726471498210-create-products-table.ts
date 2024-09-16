import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateProductsTable1726471498210 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TYPE PRODUCT_CATEGORY_ENUM as ENUM ('HOUSE', 'ELETRONICS', 'CLOTHING');
    `);

    await queryRunner.query(`
      CREATE TABLE public."products"(
        "id"          UUID PRIMARY KEY DEFAULT uuid_generate_v1mc(),
        "ownerId"     UUID NULL,
        "imageId"     UUID NULL,
        "name"        VARCHAR(100) NULL,
        "description" VARCHAR(255) NULL,
        "quantity"    INT NULL,
        "category"    PRODUCT_CATEGORY_ENUM NULL,
        "createdAt"   TIMESTAMP WITH TIME ZONE NULL,
        "updatedAt"   TIMESTAMP WITH TIME ZONE NULL,
        "removedAt"   TIMESTAMP WITH TIME ZONE NULL
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE public."products";');
    await queryRunner.query('DROP TYPE PRODUCT_CATEGORY_ENUM;');
  }
}
