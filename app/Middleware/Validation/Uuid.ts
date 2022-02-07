import ErrorMessage from "App/Modules/ErrorMessage";
import {validateUuid} from "cura-validation-utils";

export default class ValidateId {
  public async handle({ request, response }, next: () => Promise<void>) {
    if (!request.input("id") || !validateUuid(request.input("id"))) {
      return response.badRequest(ErrorMessage.Validation.InvalidId);
    }
    await next();
  }
}
