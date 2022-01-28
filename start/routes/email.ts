import Route from "@ioc:Adonis/Core/Route";

Route.group(() => {
  Route.post(
    "resendverificationmail",
    "EmailController.resendVerificationMail"
  ).middleware(["validateAndSanitizeEmail"]);
  Route.post(
    "sendpasswordresetmail",
    "EmailController.sendPasswordResetMail"
  ).middleware(["validateAndSanitizeEmail"]);
}).prefix("email");
