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
  @column({
    isPrimary: true,
  })
  public userId: string;

  @column()
  public userStatusId: number;

  @column()
  public userTypeId: number;

  public email: string;

  @column({ serializeAs: null })
  public password: string;

  @column({
    prepare: (name: string) => Encryption.encrypt(name.trim()),
    consume: (name: string) => Encryption.decrypt(name),
  })
  public firstName: string;

  @column({
    prepare: (name: string) => Encryption.encrypt(name.trim()),
    consume: (name: string) => Encryption.decrypt(name),
  })
  public lastName: string;

  @column({
    prepare: (mobile: string) => Encryption.encrypt(mobile.trim()),
    consume: (mobile: string) => Encryption.decrypt(mobile),
  })
  public mobile: string;

  @column.dateTime({
    autoCreate: true,
    serialize: (date) => date.toString(),
  })
  public dateRegistered: DateTime;

  @column.dateTime({ autoUpdate: true, serialize: (date) => date.toString() })
  public dateUpdated: DateTime;

  @beforeCreate()
  public static async generateId(user: User) {
    user.userId = uuid();
  }

  @beforeFind()
  public static async excludeDeleted(query: any) {
    query.where("UserStatusId", ">", 0);
  }

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password);
    }
  }

  @beforeSave()
  public static async encryptValues(user: User) {
    if (user.$dirty.firstName) {
      user.firstName = Encryption.encrypt(user.firstName.trim());
    }
    if (user.$dirty.lastName) {
      user.lastName = Encryption.encrypt(user.lastName.trim());
    }
    if (user.$dirty.mobile) {
      user.mobile = Encryption.encrypt(user.mobile.trim());
    }
  }
  @afterFetch()
  public static async decryptValues(users: User[]) {
    users.forEach((user: User) => {
      user.firstName = Encryption.decrypt(user.firstName)!;
      user.lastName = Encryption.decrypt(user.lastName)!;
      user.mobile = Encryption.decrypt(user.mobile)!;
    });
  }
}
