import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class UpdateUsersAddDateUpdateds extends BaseSchema {
  protected tableName = "Users";

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.timestamp("DateUpdated", { useTz: true });
    });
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) =>
      table.dropColumn("DateUpdated")
    );
  }
}
