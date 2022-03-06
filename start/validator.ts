/*
|--------------------------------------------------------------------------
| Preloaded File
|--------------------------------------------------------------------------
|
| Any code written inside this file will be executed during the application
| boot.
|
*/
import { validator } from "@ioc:Adonis/Core/Validator";
import ErrorMessage from "App/Modules/ErrorMessage"
import {validateName} from "cura-validation-utils"

validator.rule("name", (value, _, options) => {
  if (typeof value !== "string") {
    return;
  }

  if (!validateName(value)) {
    options.errorReporter.report(
      options.pointer,
      "name",
      ErrorMessage.Validation.InvalidName["errorMessage"],
      options.arrayExpressionPointer
    );
  }
});