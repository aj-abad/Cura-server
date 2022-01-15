export function validateEmail(email: string): boolean {
  const validator = require("email-validator");
  return validator.validate(email);
}
