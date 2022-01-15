import { BaseModel, column, computed } from "@ioc:Adonis/Lucid/Orm";
import { DateTime } from "luxon";
import { decrypt } from "../modules/cryptoutils";

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public userId: string;

  @column()
  public userStatusId: number;

  @column()
  public userTypeId: number;

  @column()
  public email: string;

  @column()
  public password: string;

  @column()
  public firstName: string;

  @column()
  public lastName: string;

  @column()
  public mobile: string;

  @column.dateTime({ autoCreate: true })
  public dateRegistered: DateTime;

  @column.dateTime({ autoUpdate: true })
  public dateUpdated: DateTime;

  @computed()
  public get decryptedEmail(): string {
    return decrypt(this.email);
  }

  @computed()
  public get decryptedMobile(): string {
    return decrypt(this.mobile);
  }

  @computed()
  public get decryptedName(): object {
    return {
      firstName: decrypt(this.firstName),
      lastName: decrypt(this.lastName),
    };
  }
}
