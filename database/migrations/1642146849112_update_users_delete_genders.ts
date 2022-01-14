import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class UpdateUsersDeleteGenders extends BaseSchema {
  protected tableName = "Users";

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn("Gender");
    });
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer("Gender");
    });
  }
}
