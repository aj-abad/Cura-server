import Route from "@ioc:Adonis/Core/Route";

Route.group(() => {
  
  Route.post(
    "resendverificationmail",
    "EmailController.resendVerificationMail"
  ).middleware(["validate:email"]);
  
  Route.post(
    "sendpasswordresetmail",
    "EmailController.sendPasswordResetMail"
  ).middleware(["validate:email"]);
  
}).prefix("email");
