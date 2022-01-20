import { column, BaseModel } from "@ioc:Adonis/Lucid/Orm";

export default class Auth extends BaseModel {
  public static table = "Users";

  @column({ isPrimary: true })
  public UserId: number;

  @column()
  public UserTypeId: number;
}
