import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class RemovePendingSignups extends BaseSchema {
  protected tableName = "PendingSignups";

  public async up() {
    this.schema.dropTable(this.tableName);
  }

  public async down() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid("PendingSignupId").primary();
      table.string("Email").notNullable();
      table.string("Code").notNullable();
      table.timestamp("DateCreated", { useTz: true });
    });
  }
}
