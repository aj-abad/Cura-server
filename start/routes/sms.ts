import Route from "@ioc:Adonis/Core/Route";

Route.group(() => {
  Route.post("sendverificationsms", "SmsController.sendVerificationCode").middleware(["auth"]);
}).prefix("sms")