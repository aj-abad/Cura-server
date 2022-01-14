import Route from "@ioc:Adonis/Core/Route";
import Database from "@ioc:Adonis/Lucid/Database";
import { encrypt, hash } from "../../app/modules/cryptoutils";
import { errorMessage } from "../../app/modules/errormessages";
import User from "App/Models/User";

Route.post("auth/checkemail", async (ctx) => {
  const email = ctx.request.input("email")?.toLowerCase().trim();
  const validator = require("email-validator");
  if (!validator.validate(email))
    return ctx.response.badRequest({
      errorMessage: errorMessage.auth.invalidEmail,
    });
  const encryptedEmail = encrypt(email);

  const emailExists = !!(await Database.from("Users")
    .where("email", encryptedEmail)
    .where("UserStatusId", ">", 0)
    .select(1)
    .first());

  console.log(emailExists);
  return { emailExists };
});

Route.post("auth/signup", async ({ request, response }) => {
  const email = request.input("email")?.toLowerCase().trim();
  const validator = require("email-validator");
  if (!validator.validate(email))
    return response.badRequest({
      errorMessage: errorMessage.auth.invalidEmail,
    });

  const password = request.input("password");
  if (password.length < 6)
    return response.badRequest({
      errorMessage: errorMessage.auth.passwordTooShort,
    });
  if (password.length > 128)
    return response.badRequest({
      errorMessage: errorMessage.auth.passwordTooLong,
    });
  //TODO actual signup logic
});

Route.post("auth/signin", async ({ request, response }) => {
  const email = request.input("email")?.toLowerCase().trim();
  const password = request.input("password");
});
