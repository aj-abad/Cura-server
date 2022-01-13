import Route from "@ioc:Adonis/Core/Route";
import Database from "@ioc:Adonis/Lucid/Database";
import { encrypt, decrypt } from "../../app/modules/cryptoutils";

Route.post("auth/checkemail", async (ctx) => {
  const email = ctx.request.input("email")?.toLowerCase().trim();
  const validator = require("email-validator");
  if (!validator.validate(email))
    return ctx.response.badRequest({
      errorMessage: "Please enter a valid email.",
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
