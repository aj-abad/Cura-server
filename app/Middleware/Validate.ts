import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import ErrorMessage from "App/Modules/ErrorMessage";
import {
  validateUuid,
  validateMobile,
  validateName,
} from "cura-validation-utils";

/*
validation middleware
accepts a list of validations (email, name, mobile, uuid)
parameters are required by default
optional parameters must be indicated with $optional
*/

export default class Validate {
  private validationRules: Map<string, string> | null = null;
  private validateId(request): boolean {
    if (this.validationRules!.get("id") === "optional" && !request.input("id"))
      return true;
    return !!request.input("id") && validateUuid(request.input("id"));
  }

  private validateEmail(request): boolean {
    if (
      this.validationRules!.get("email") === "optional" &&
      !request.input("email")
    )
      return true;

    const email: string = request.input("email");
    const validator = require("email-validator");
    const normalize = require("normalize-email");

    if (email?.length === 0) return false;

    const normalizedEmail = normalize(email);

    if (!validator.validate(normalizedEmail)) return false;

    request.input("email", normalizedEmail);
    return true;
  }

  private validateMobile(request): boolean {
    if (
      this.validationRules!.get("mobile") === "optional" &&
      !request.input("mobile")
    )
      return true;
    const mobile: string = request.input("mobile");
    return validateMobile(mobile);
  }

  private validateName(request): boolean {
    const { firstName, lastName } = request.all();

    if (
      this.validationRules!.get("name") === "optional" &&
      !firstName &&
      !lastName
    )
      return true;
    request.input("firstName", firstName.trim());
    request.input("firstName", lastName.trim());
    return !!firstName && validateName(`${firstName} ${lastName}`);
  }

  private setValidationRules(toValidate: string[]): void {
    this.validationRules = new Map<string, string>();
    toValidate
      .map((rule) => rule.split("$"))
      .forEach((rule) =>
        this.validationRules!.set(
          rule[0],
          rule[1] === "optional" ? "optional" : "required"
        )
      );
  }

  public async handle(
    { request, response }: HttpContextContract,
    next: () => Promise<void>,
    toValidate: string[]
  ) {
    this.setValidationRules(toValidate);

    if (this.validationRules!.get("id") && !this.validateId(request))
      return response.badRequest(ErrorMessage.Validation.InvalidId);
    if (this.validationRules!.get("email") && !this.validateEmail(request))
      return response.badRequest(ErrorMessage.Validation.InvalidEmail);
    if (this.validationRules!.get("mobile") && !this.validateMobile(request))
      return response.badRequest(ErrorMessage.Validation.InvalidMobile);
    if (this.validationRules!.get("name") && !this.validateName(request))
      return response.badRequest(ErrorMessage.Validation.InvalidName);
    await next();
  }
}
