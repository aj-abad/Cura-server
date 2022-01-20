import Route from "@ioc:Adonis/Core/Route";

Route.group(() => {
  Route.post(
    "resendverificationmail",
    "EmailController.resendVerificationMail"
  ).middleware(["validateAndSanitizeEmail"]);
}).prefix("email");
