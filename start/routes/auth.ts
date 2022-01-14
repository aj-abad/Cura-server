import Route from "@ioc:Adonis/Core/Route";
import Database from "@ioc:Adonis/Lucid/Database";
import { encrypt, hash } from "App/Modules/cryptoutils";
import { errorMessage } from "App/Modules/errormessages";
import PendingSignup from "App/Models/PendingSignup";
import { v4 as uuid } from "uuid";
import { generateCode } from "App/Modules/stringutils";
import { DateTime } from "luxon";
import Env from "@ioc:Adonis/Core/Env";
import { sendSignupVerificationMail } from "App/Modules/emailutils";

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
      .andWhere("UserStatusId", ">", 0)
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

    const encryptedEmail = encrypt(email);
    const passwordHash = hash(password);
    const codeSentSince = DateTime.utc()
      .minus({ minutes: Env.get("VERIFICATION_CODE_COOLDOWN_MINUTES") })
      .toString();
    const recentCodeExists = !!(await Database.from("PendingSignups")
      .where("email", encryptedEmail)
      .andWhere("dateCreated", ">=", codeSentSince)
      .select(1)
      .first());

    if (recentCodeExists) {
      const record: PendingSignup = await Database.from("PendingSignups")
        .where("email", encryptedEmail)
        .first();
      record.password = passwordHash;
      await record.save();
    } else {
      await Database.from("PendingSignups")
        .where("email", encryptedEmail)
        .delete();
      const newSignup = new PendingSignup().fill({
        pendingSignupId: uuid(),
        email: encryptedEmail,
        password: passwordHash,
        code: generateCode(5),
        dateCreated: DateTime.utc(),
      });

      await newSignup.save();
      //TODO send email
      sendSignupVerificationMail(email, newSignup.code);
    }
    return recentCodeExists ? response.ok(null) : response.created();
  });

  Route.post("auth/signin", async ({ request, response }) => {
    const email = request.input("email")?.toLowerCase().trim();
    const password = request.input("password");
    //TODO create sign in logic
  });
}).prefix("auth");
