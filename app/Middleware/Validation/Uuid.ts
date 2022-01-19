import ErrorMessage from "App/Modules/ErrorMessage";
import Validation from "App/Modules/Validation";

export default class ValidateId {
  public async handle({ request, response }, next: () => Promise<void>) {
    if (!request.input("id") || !Validation.validateUuid(request.input("id"))) {
      return response.badRequest(ErrorMessage.Validation.InvalidId);
    }
    await next();
  }
}
