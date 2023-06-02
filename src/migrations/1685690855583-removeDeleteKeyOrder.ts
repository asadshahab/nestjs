import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveDeleteKeyOrder1685690855583 implements MigrationInterface {
    name = 'RemoveDeleteKeyOrder1685690855583'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "deleteTime"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order" ADD "deleteTime" character varying`);
    }

}
