import Route from "@ioc:Adonis/Core/Route";

Route.group(() => {
  Route.get("details", "AccountController.getUserDetails").middleware(["auth"]);
  
  Route.post("setup", "AccountController.setup").middleware([
    "auth:api",
    "userStatus:2",
    ()=> import ("App/Middleware/Validation/AccountSetup"),
  ]);
  Route.post("resetpassword", "AccountController.resetPassword").middleware(["validate:email"]);
}).prefix("account");