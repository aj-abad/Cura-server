import Route from "@ioc:Adonis/Core/Route";
import Database from "@ioc:Adonis/Lucid/Database";

Route.post("auth/checkemail", async (ctx) => {
  const email = ctx.request.input("email");
  const validator = require("email-validator");
  if (!validator.validate(email))
    return ctx.response.badRequest({
      errorMessage: "Please enter a valid email.",
    });

  console.log(email);
  // return Database.from("users").select("*");
});
