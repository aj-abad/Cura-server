export default class VerifyMobile {
  public constructor(init?: Partial<VerifyMobile>) {
    Object.assign(this, init);
  }
  public UserId: string;
  public Mobile: string;
  public Code: string;
  public DateCreated: number;
}
