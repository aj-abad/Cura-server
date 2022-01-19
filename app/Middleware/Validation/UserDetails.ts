import ErrorMessage from "App/Modules/ErrorMessage";
import Validation from "App/Modules/Validation";

export default class ValidateUserDetails {
  public async handle({ request, response }, next: () => Promise<void>) {
    const firstName: string = request.input("firstName");
    const lastName = request.input("lastName");
    const mobile = request.input("mobile");

    //validate
    if (!Validation.validateName(`${firstName} ${lastName}`)) {
      return response.badRequest(ErrorMessage.Validation.InvalidName);
    }
    if (mobile && !Validation.validateMobile(mobile)) {
      return response.badRequest(ErrorMessage.Validation.InvalidMobile);
    }

    //sanitize
    request.input("firstName", firstName?.trim());
    request.input("lastName", lastName?.trim());
    request.input("mobile", mobile?.trim());
    await next();
  }
}
