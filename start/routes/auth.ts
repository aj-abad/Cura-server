import Route from "@ioc:Adonis/Core/Route";
import Database from "@ioc:Adonis/Lucid/Database";
import { errorMessage } from "App/Modules/errormessages";
import PendingSignup from "App/Models/PendingSignup";
import { v4 as uuid } from "uuid";
import { generateCode } from "App/Modules/stringutils";
import { DateTime } from "luxon";
import Env from "@ioc:Adonis/Core/Env";
import { sendSignupVerificationMail } from "App/Modules/emailutils";
import User from "App/Models/User";
import Encryption from "@ioc:Adonis/Core/Encryption";
import { validateEmail } from "App/Modules/validationutils";

Route.group(() => {
  // console.log(user);

  Route.post("checkemail", async (ctx) => {
    const email = ctx.request.input("email")?.toLowerCase().trim();
    if (!validateEmail(email))
      return ctx.response.badRequest({
        errorMessage: errorMessage.auth.invalidEmail,
      });

    const emailExists = !!(await Database.from("Users")
      .where("email", Encryption.encrypt(email))
      .andWhere("UserStatusId", ">", 0)
      .select(1)
      .first());

    return { emailExists };
  });

  Route.post("signup", async ({ request, response }) => {
    const email = request.input("email");
    const password = request.input("password");
    if (!validateEmail(email))
      return response.badRequest({
        errorMessage: errorMessage.auth.invalidEmail,
      });

    if (password.length < 6)
      return response.badRequest({
        errorMessage: errorMessage.auth.passwordTooShort,
      });
    if (password.length > 128)
      return response.badRequest({
        errorMessage: errorMessage.auth.passwordTooLong,
      });

    const codeSentSince = DateTime.utc()
      .minus({ minutes: Env.get("VERIFICATION_CODE_COOLDOWN_MINUTES") })
      .toString();
    const recentlySignedUp = await PendingSignup.query()
      .where("email", email)
      .andWhere("dateCreated", ">=", codeSentSince)
      .first();

    if (recentlySignedUp) {
      return response.ok(null);
    }

    const newSignup = await new PendingSignup()
      .fill({
        pendingSignupId: uuid(),
        email,
        password,
        code: generateCode(5),
        dateCreated: DateTime.utc(),
      })
      .save();
    sendSignupVerificationMail(email, newSignup.code);

    return response.created();
  });

  Route.post("verifyemail", async ({ request, response }) => {
    const email = request.input("email")?.toLowerCase().trim();
    const code = request.input("code");
    const validator = require("email-validator");
    if (!validator.validate(email))
      return response.badRequest({
        errorMessage: errorMessage.auth.invalidEmail,
      });

    const userToVerify = await Database.from("PendingSignUps")
      .where("code", code)
      .andWhere("email", email)
      .select("DateCreated, Email, Password")
      .first();

    if (!userToVerify) {
      return response.badRequest({
        errorMessage: errorMessage.auth.codeInvalid,
      });
    }

    const { DateCreated } = userToVerify;
    const codeExpiredTime = DateTime.utc().minus({
      minutes: Env.get("VERIFICATION_CODE_EXPIRY_MINUTES"),
    });
    if (DateCreated.toMillis() < codeExpiredTime.toMillis()) {
      return response.badRequest({
        errorMessage: errorMessage.auth.codeExpired,
      });
    }

    const newUser = await new User()
      .fill({
        userId: uuid(),
        userStatusId: 1,
        userTypeId: 1,
        email: userToVerify.Email,
        password: userToVerify.Password,
      })
      .save();
    userToVerify.delete();
    return response.created();
  });

  Route.post("auth/signin", async ({ request, response }) => {
    const email = request.input("email")?.toLowerCase().trim();
    const password = request.input("password");
    //TODO create sign in logic
  });
}).prefix("auth");
