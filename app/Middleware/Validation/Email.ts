import ErrorMessage from "App/Modules/ErrorMessage";
import Validation from "App/Modules/Validation";

export default class ValidateAndSanitizeEmail {
  public async handle({ request, response }, next: () => Promise<void>) {
    const email = request.input("email");
    if (!email || !Validation.validateEmail(email)) {
      return response.badRequest(ErrorMessage.Validation.InvalidEmail);
    }
    request.input("email", email.toLowerCase().trim());
    await next();
  }
}
