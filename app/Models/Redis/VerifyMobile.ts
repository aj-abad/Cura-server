import Stringable  from "./Stringable";

export default class VerifyMobile extends Stringable {
  public constructor(init?: Partial<VerifyMobile>) {
    super();
    Object.assign(this, init);
  }
  public UserId: string;
  public Mobile: string;
  public Code: string;
  public DateCreated: number;
}