import Route from "@ioc:Adonis/Core/Route";

Route.group(() => {
  Route.post("setup", "AccountController.setup").middleware(["auth"]);
}).prefix("account");
