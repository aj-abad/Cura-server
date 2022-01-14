import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class UpdatePendingSignupsAddPasswords extends BaseSchema {
  protected tableName = "PendingSignups";

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string("Password").notNullable();
    });
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn("Password");
    });
  }
}
