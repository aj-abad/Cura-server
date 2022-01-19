export default class ErrorMessage {
  public static err(errorMessage: string): object {
    return { errorMessage };
  }

  public static Validation = {
    InvalidEmail: this.err("Please enter a valid email address."),
    InvalidId: this.err("Invalid ID."),
    PasswordTooShort: this.err("Password must be at least 6 characters."),
    PasswordTooLong: this.err("Password is too long."),
  };

  public static Auth = {
    InvalidCredentials: this.err("Invalid credentials."),
    UserTypeMismatch: this.err("This account is for a different Cura app."),
    EmailInUse: this.err("This email address is already in use."),
    CodeInvalid: this.err("This code is expired or invalid."),
  };

  public static Email = {
    ResendCode(seconds: number): object {
      return this.err(`Please wait ${seconds} seconds before resending.`);
    },
  };
}
