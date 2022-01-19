export default class PendingSignup {
  public constructor(init?: Partial<Person>) {
    Object.assign(this, init);
  }
  public Email: string;
  public Password: string;
  public Code: string;
  public DateCreated: number;
}
