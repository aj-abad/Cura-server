export default class ErrorMessage {
  public static Error(errorMessage: string): object {
    return { errorMessage };
  }

  public static Auth = {
    InvalidEmail: Error("Please enter a valid email address."),
    InvalidCredentials: Error("Invalid credentials."),
    PasswordTooShort: Error("Password must be at least 6 characters."),
    PasswordTooLong: Error("Password is too long."),
    UserTypeMismatch: Error("This account is for a different Cura app."),
    EmailInUse: Error("This email address is already in use."),
    CodeInvalid: Error("This code is expired or invalid."),
  };
}
