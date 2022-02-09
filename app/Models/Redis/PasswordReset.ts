import Stringable from "./Stringable";

export default class PendingSignup extends Stringable {
  public constructor(init?: Partial<PendingSignup>) {
    super();
    Object.assign(this, init);
  }
  public Email: string;
  public Code: string;
  public DateCreated: number;
}
