import {
  BaseModel,
  column,
  beforeSave,
  beforeCreate,
  afterFind,
} from "@ioc:Adonis/Lucid/Orm";
import { DateTime } from "luxon";
import Hash from "@ioc:Adonis/Core/Hash";
import { v4 as uuid } from "uuid";

export default class PendingSignup extends BaseModel {
  public static selfAssignPrimaryKey = true;

  @column({ isPrimary: true })
  public PendingSignupId: string;

  @column()
  public Email: string;

  @column()
  public Password: string;

  @column()
  public Code: string;

  @column.dateTime({ autoCreate: true })
  public dateCreated: DateTime;

  @beforeCreate()
  public static async generateId(pendingSignUp: PendingSignup) {
    pendingSignUp.PendingSignupId = uuid();
  }
  @beforeSave()
  public static async hashPassword(pendingSignUp: PendingSignup) {
    pendingSignUp.Password = await Hash.make(pendingSignUp.Password);
  }
}
