import { DateTime } from "luxon";
import { BaseModel, column } from "@ioc:Adonis/Lucid/Orm";

export default class PendingSignup extends BaseModel {
  @column({ isPrimary: true })
  public pendingSignupId: string;

  @column()
  public email: string;

  @column()
  public password: string;

  @column()
  public code: string;

  @column()
  public dateCreated: DateTime;
}
