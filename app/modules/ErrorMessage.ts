export default class ErrorMessage {
  public static err(errorMessage: string): object {
    return { errorMessage };
  }

  public static Auth = {
    InvalidEmail: this.err("Please enter a valid email address."),
    InvalidCredentials: this.err("Invalid credentials."),
    PasswordTooShort: this.err("Password must be at least 6 characters."),
    PasswordTooLong: this.err("Password is too long."),
    UserTypeMismatch: this.err("This account is for a different Cura app."),
    EmailInUse: this.err("This email address is already in use."),
    CodeInvalid: this.err("This code is expired or invalid."),
  };
}
