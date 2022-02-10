import Route from "@ioc:Adonis/Core/Route";

Route.group(() => {
  Route.post("sendverificationcode", "SmsController.sendConfirmation").middleware(["auth"]);
}).prefix("sms")