import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatDB1685690696017 implements MigrationInterface {
    name = 'CreatDB1685690696017'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "username" character varying, "email" character varying NOT NULL, "phoneNum" character varying NOT NULL, "role" character varying NOT NULL, "password" character varying NOT NULL, CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "order" ("id" SERIAL NOT NULL, "quantity" integer NOT NULL, "status" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deleteTime" character varying, "userId" integer, CONSTRAINT "PK_1031171c13130102495201e3e20" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "product" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" character varying NOT NULL, "price" integer NOT NULL, "status" character varying NOT NULL, CONSTRAINT "PK_bebc9158e480b949565b4dc7a82" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "orderProduct" ("productId" integer NOT NULL, "orderId" integer NOT NULL, CONSTRAINT "PK_67cf13b6f5f4125554a6c2df2ab" PRIMARY KEY ("productId", "orderId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_7d18d1fafedc1b39c5f2c40c03" ON "orderProduct" ("productId") `);
        await queryRunner.query(`CREATE INDEX "IDX_16ed2dd2152e905b788b430218" ON "orderProduct" ("orderId") `);
        await queryRunner.query(`ALTER TABLE "order" ADD CONSTRAINT "FK_caabe91507b3379c7ba73637b84" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "orderProduct" ADD CONSTRAINT "FK_7d18d1fafedc1b39c5f2c40c03d" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "orderProduct" ADD CONSTRAINT "FK_16ed2dd2152e905b788b4302180" FOREIGN KEY ("orderId") REFERENCES "order"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orderProduct" DROP CONSTRAINT "FK_16ed2dd2152e905b788b4302180"`);
        await queryRunner.query(`ALTER TABLE "orderProduct" DROP CONSTRAINT "FK_7d18d1fafedc1b39c5f2c40c03d"`);
        await queryRunner.query(`ALTER TABLE "order" DROP CONSTRAINT "FK_caabe91507b3379c7ba73637b84"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_16ed2dd2152e905b788b430218"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_7d18d1fafedc1b39c5f2c40c03"`);
        await queryRunner.query(`DROP TABLE "orderProduct"`);
        await queryRunner.query(`DROP TABLE "product"`);
        await queryRunner.query(`DROP TABLE "order"`);
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
