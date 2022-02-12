import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class UpdateUsersAddBirthDates extends BaseSchema {
  protected tableName = "Users";

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dateTime("BirthDate");
    });
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn("BirthDate");
    });
  }
}
