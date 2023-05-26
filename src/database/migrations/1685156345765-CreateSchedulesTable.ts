import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from "typeorm";

export class CreateSchedulesTable1685156345765 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "schedules",
        columns: [
          {
            name: "id",
            type: "integer",
            unsigned: true,
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          {
            name: "date",
            type: "timestamp",
          },
          {
            name: "shiftHours",
            type: "float",
            unsigned: true,
          },
          {
            name: "user",
            type: "integer",
            unsigned: true,
          },
          {
            name: "createdAt",
            type: "timestamp",
            default: "now()",
          },
        ],
      })
    );

    await queryRunner.createForeignKey(
      "schedules",
      new TableForeignKey({
        columnNames: ["user"],
        referencedColumnNames: ["id"],
        referencedTableName: "users",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("schedules");
  }
}
