import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class Updateusers extends BaseSchema {
  protected tableName = "Users";

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer("UserTypeId").notNullable();
      table.integer("UserStatusId").notNullable();
      table.string("Email").notNullable();
      table.string("Password").notNullable();
      table.string("FirstName");
      table.string("LastName");
      table.string("Mobile").nullable();
      table.integer("Gender").nullable();
      table.timestamp("DateRegistered").notNullable();
      table.string("ProfileImage").nullable();
      table.string("FacebookId").nullable();
    });
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn("UserTypeId");
      table.dropColumn("Email");
      table.dropColumn("Password");
      table.dropColumn("FirstName");
      table.dropColumn("LastName");
      table.dropColumn("Mobile");
      table.dropColumn("Gender");
      table.dropColumn("DateRegistered");
      table.dropColumn("ProfileImage");
      table.dropColumn("FacebookId");
    });
  }
}
