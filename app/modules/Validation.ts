export default class Validation {
  public static validateEmail(email: string): boolean {
    const validator = require("email-validator");
    return validator.validate(email);
  }
}
