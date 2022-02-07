import Route from "@ioc:Adonis/Core/Route";

Route.group(() => {
  Route.get("details", "AccountController.getUserDetails").middleware(["auth"]);
  
  Route.post("setup", "AccountController.setup").middleware([
    "auth:api",
    "authorizeUserStatus:2",
    "validateAndSanitizeEmail",
  ]);
  
  Route.post("resetpassword", "AccountController.resetPassword").middleware([
    "validateAndSanitizeEmail",
  ]);
}).prefix("account");
