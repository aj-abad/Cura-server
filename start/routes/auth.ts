import Route from "@ioc:Adonis/Core/Route";
import Database from "@ioc:Adonis/Lucid/Database";
import { encrypt, hash } from "App/Modules/cryptoutils";
import { errorMessage } from "App/Modules/errormessages";
import PendingSignup from "App/Models/PendingSignup";
import { v4 as uuid } from "uuid";
import { generateCode } from "App/Modules/stringutils";
import { DateTime } from "luxon";

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

  const passwordHash = hash(password);
  const newSignup = new PendingSignup();
  newSignup.pendingSignupId = uuid();
  newSignup.email = encrypt(email);
  newSignup.password = passwordHash;
  newSignup.code = generateCode(5);
  newSignup.dateCreated = DateTime.utc();
  await newSignup.save();

  return response.created();
});

Route.post("auth/signin", async ({ request, response }) => {
  const email = request.input("email")?.toLowerCase().trim();
  const password = request.input("password");
});
