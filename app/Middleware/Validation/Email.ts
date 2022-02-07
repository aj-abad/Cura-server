import ErrorMessage from "App/Modules/ErrorMessage";
import {validateEmail} from "cura-validation-utils";

export default class ValidateAndSanitizeEmail {
  public async handle({ request, response }, next: () => Promise<void>) {
    const email = request.input("email");
    if (!email || !validateEmail(email)) {
      return response.badRequest(ErrorMessage.Validation.InvalidEmail);
    }
    request.input("email", email.toLowerCase().trim());
    await next();
  }
}
