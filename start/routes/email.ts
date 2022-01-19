import Route from "@ioc:Adonis/Core/Route";

Route.group(() => {
  Route.post("resend", "EmailController.resend");
}).prefix("email");
