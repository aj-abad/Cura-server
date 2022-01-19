export default class PendingSignup {
  public constructor(init?: Partial<PendingSignup>) {
    Object.assign(this, init);
  }
  public Email: string;
  public Password: string;
  public Code: string;
  public DateCreated: number;
}
