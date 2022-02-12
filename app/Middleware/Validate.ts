import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import ErrorMessage from "App/Modules/ErrorMessage";
import { validateUuid } from "cura-validation-utils";

export default class Validate {
  private validateId(request): boolean {
    return !!request.input("id") && validateUuid(request.input("id"));
  }

  private validateEmail(request): boolean {
    const email: string = request.input("email");
    const validator = require("email-validator");
    const normalize = require("normalize-email");

    if (email?.length === 0) return false;

    const normalizedEmail = normalize(email);

    if (!validator.validate(normalizedEmail)) return false;

    request.input("email", normalizedEmail);
    return true;
  }

  public async handle(
    {request, response }: HttpContextContract,
    next: () => Promise<void>,
    toValidate: string[]
  ) {
    if (toValidate.includes("id") && !this.validateId(request))
      return response.badRequest(ErrorMessage.Validation.InvalidId);

    if (toValidate.includes("email") && !this.validateEmail(request)) {
      return response.badRequest(ErrorMessage.Validation.InvalidEmail);
    }

    await next();
  }
}
