import Route from "@ioc:Adonis/Core/Route";
import Database from "@ioc:Adonis/Lucid/Database";
import { encrypt, hash } from "App/Modules/cryptoutils";
import { errorMessage } from "App/Modules/errormessages";
import PendingSignup from "App/Models/PendingSignup";
import { v4 as uuid } from "uuid";
import { generateCode } from "App/Modules/stringutils";
import { DateTime } from "luxon";

Route.group(() => {
  Route.post("checkemail", async (ctx) => {
    const email = ctx.request.input("email")?.toLowerCase().trim();
    const validator = require("email-validator");
    if (!validator.validate(email))
      return ctx.response.badRequest({
        errorMessage: errorMessage.auth.invalidEmail,
      });

    const emailExists = !!(await Database.from("Users")
      .where("email", encrypt(email))
      .where("UserStatusId", ">", 0)
      .select(1)
      .first());

    return { emailExists };
  });

  Route.post("signup", async ({ request, response }) => {
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
    //TODO send email
    return response.created();
  });

  Route.post("auth/signin", async ({ request, response }) => {
    const email = request.input("email")?.toLowerCase().trim();
    const password = request.input("password");
    //TODO create sign in logic
  });
}).prefix("auth");
