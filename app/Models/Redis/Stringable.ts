export default class Stringable {
  public toString(): string {
    return JSON.stringify(this);
  }
}
