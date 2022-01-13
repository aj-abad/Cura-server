import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class Users extends BaseSchema {
  protected tableName = "Users";

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid("UserId").primary();
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
