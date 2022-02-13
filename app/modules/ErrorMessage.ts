export default class ErrorMessage {
  public static err(errorMessage: string): object {
    return { errorMessage };
  }

  public static General = {
    FieldsRequired: this.err("Please fill in all the fields"),
  }

  public static Validation = {
    InvalidEmail: this.err("Please enter a valid email address."),
    InvalidId: this.err("Invalid ID."),
    InvalidName: this.err("Name has invalid characters."),
    InvalidMobile: this.err("Please enter a valid mobile number."),
    PasswordTooShort: this.err("Password must be at least 6 characters."),
    PasswordTooLong: this.err("Password is too long."),
  };

  public static Auth = {
    InvalidCredentials: this.err("These credentials don't match our records."),
    UserTypeMismatch: this.err("This account is for a different Cura app."),
    EmailInUse: this.err("This email address is already in use."),
    CodeInvalid: this.err("This code is expired or invalid."),
  };

  public static Email = {
    ResendCode(seconds: number): object {
      return this.err(`Please wait ${seconds} seconds before resending.`);
    },
    EmailNotFound: this.err("No user found with this email."),
  };


  public static SMS = {
    CodeInvalid: this.err("This code is expired or invalid."),
    
  }
}
