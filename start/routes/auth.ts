import Route from "@ioc:Adonis/Core/Route";

Route.group(() => {
  Route.post("checkemail", "AuthController.checkEmail");
  Route.post("signup", "AuthController.signUp");
  Route.post("verify", "AuthController.verify");
  Route.post("signin", "AuthController.signIn");
}).prefix("auth");
