import {
  BaseModel,
  column,
  beforeSave,
  beforeCreate,
  beforeFind,
  afterFetch,
} from "@ioc:Adonis/Lucid/Orm";
import Encryption from "@ioc:Adonis/Core/Encryption";
import { DateTime } from "luxon";
import Hash from "@ioc:Adonis/Core/Hash";
import { v4 as uuid } from "uuid";

export default class User extends BaseModel {
  public static selfAssignPrimaryKey = true;

  public shouldHashPassword = true;

  @column({
    isPrimary: true,
  })
  public UserId: string;

  @column({ serializeAs: "userStatus" })
  public UserStatusId: number;

  @column()
  public UserTypeId: number;

  @column()
  public Email: string;

  @column({ serializeAs: null })
  public Password: string;

  @column()
  public FirstName: string;

  @column()
  public LastName: string;

  @column()
  public Mobile: string;

  @column()
  public ProfileImage: string;

  @column.dateTime({
    serializeAs: null,
    autoCreate: true,
    serialize: (date) => date.toString(),
  })
  public dateRegistered: DateTime;

  @column.dateTime({
    serializeAs: null,
    autoUpdate: true,
    serialize: (date) => date.toString(),
  })
  public dateUpdated: DateTime;

  @beforeCreate()
  public static async generateId(user: User) {
    user.UserId = uuid();
  }

  @beforeFind()
  public static async excludeDeleted(query: any) {
    query.where("UserStatusId", ">", 0);
  }

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password && user.shouldHashPassword) {
      user.Password = await Hash.make(user.Password);
    }
  }

  @beforeSave()
  public static encryptValues(user: User) {
    if (user.$dirty.FirstName) {
      user.FirstName = Encryption.encrypt(user.FirstName);
    }
    if (user.$dirty.LastName) {
      user.LastName = Encryption.encrypt(user.LastName);
    }
    if (user.$dirty.Mobile) {
      user.Mobile = Encryption.encrypt(user.Mobile);
    }
    if (user.$dirty.ProfileImage) {
      user.ProfileImage = Encryption.encrypt(user.ProfileImage);
    }
  }
  @afterFetch()
  public static async decryptValues(users: User[]) {
    users.forEach((user: User) => {
      user.FirstName = Encryption.decrypt(user.FirstName)!;
      user.LastName = Encryption.decrypt(user.LastName)!;
      user.Mobile = Encryption.decrypt(user.Mobile)!;
      user.ProfileImage = Encryption.decrypt(user.ProfileImage)!;
    });
  }
}
