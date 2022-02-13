import ErrorMessage from "App/Modules/ErrorMessage";
import { DateTime } from "luxon";
import {validateName} from "cura-validation-utils";

export default class ValidateUserDetails {
  public async handle({ request, response }, next: () => Promise<void>) {
   const {firstName, lastName, birthDate} = request.all();

    //validate
    if (!(firstName || lastName) || !birthDate) 
      return response.badRequest(ErrorMessage.General.FieldsRequired)
    if (!validateName(`${firstName} ${lastName}`)) {
      return response.badRequest(ErrorMessage.Validation.InvalidName);
    }
    //check if at least 18 years old
    const isUnder18 = DateTime.fromISO(birthDate).diffNow().years < 18;
    if (isUnder18) 
      return response.badRequest({errorMessage: "You must be at least 18 years old to register"});
    //sanitize
    request.input("firstName", firstName?.trim());
    request.input("lastName", lastName?.trim());
    await next();
  }
}
