import Route from "@ioc:Adonis/Core/Route";
import Env from "@ioc:Adonis/Core/Env";
import { DateTime } from "luxon";
import { errorMessage } from "App/Modules/errormessages";
import { generateCode } from "App/Modules/stringutils";
import { EmailUtils } from "App/Modules/emailutils";
import { validateEmail } from "App/Modules/validationutils";
import { UserType } from "App/Enums/UserType";
import PendingSignup from "App/Models/PendingSignup";
import User from "App/Models/User";
import Database from "@ioc:Adonis/Lucid/Database";
import Hash from "@ioc:Adonis/Core/Hash";

Route.group(() => {
  Route.post("checkemail", async ({ request, response }) => {
    const email = request.input("email")?.toLowerCase().trim();
    const userType = parseInt(request.input("userType"));
    if (!Object.values(UserType).includes(userType)) {
      return response.badRequest();
    }

    if (!validateEmail(email))
      return response.badRequest({
        errorMessage: errorMessage.auth.invalidEmail,
      });

    const matchedUser = await User.findBy("Email", email);
    const emailExists = !!matchedUser;
    if (!matchedUser) {
      return { emailExists };
    }

    if (matchedUser.UserTypeId !== userType) {
      return response.badRequest({
        errorMessage: errorMessage.auth.userTypeMismatch,
      });
    }
    return { emailExists };
  });

  Route.post("signup", async ({ request, response }) => {
    const email = request.input("email")?.toLowerCase().trim();
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

    const existingUser = await User.findBy("Email", email);
    if (!!existingUser)
      return response.conflict({ errorMessage: errorMessage.auth.emailInUse });

    const codeSentSince = DateTime.utc()
      .minus({ minutes: Env.get("VERIFICATION_CODE_COOLDOWN_MINUTES") })
      .toMillis();

    const existingPendingSignup = await PendingSignup.query()
      .where("Email", email)
      .first();

    if (
      existingPendingSignup &&
      existingPendingSignup.DateCreated.toMillis() >= codeSentSince
    ) {
      console.log(existingPendingSignup);
      //only update password if code is still valid
      existingPendingSignup.Password = password;
      await existingPendingSignup.save();
      return response.ok(null);
    }
    //otherwise delete old sign up records if any and create new
    await Database.from("PendingSignups").where("email", email).delete();
    //then send an email
    const code = generateCode(5);
    await new PendingSignup()
      .merge({
        Email: email,
        Password: password,
        Code: code,
      })
      .save();
    EmailUtils.sendSignupVerificationMail(email, code);
  });

  Route.post("verify", async ({ auth, request, response }) => {
    const code = request.input("code");
    const email = request.input("email")?.toLowerCase().trim();
    //Find user to verify
    const toVerify = await PendingSignup.query()
      .where("Email", email)
      .andWhere("Code", code)
      .first();

    //if no matching record found
    if (!toVerify)
      return response.unauthorized({
        errorMessage: errorMessage.auth.codeInvalid,
      });

    //if code is expired
    if (
      toVerify.DateCreated.toMillis() <
      DateTime.utc()
        .minus({ minutes: Env.get("VERIFICATION_CODE_EXPIRY_MINUTES") })
        .toMillis()
    ) {
      return response.badRequest({
        errorMessage: errorMessage.auth.codeExpired,
      });
    }

    const { Email, Password } = toVerify;

    //create user and delete pending signup record
    await Database.from("PendingSignups").where("email", Email).delete();
    const newUser = new User();
    newUser.shouldHashPassword = false;
    newUser.merge({
      Email,
      Password,
      UserStatusId: 2,
      UserTypeId: 1,
    });

    await newUser.save();
    return response.created(await auth.use("api").generate(newUser));
  });

  Route.post("signin", async ({ auth, request, response }) => {
    const email = request.input("email")?.toLowerCase().trim();
    const password = request.input("password");

    //Find matching user
    const user = await User.findBy("Email", email);
    if (!user)
      return response.unauthorized({
        errorMessage: errorMessage.auth.invalidCredentials,
      });

    //Get stuff from user
    const { UserStatusId: userStatus } = user;
    const isPasswordValid = await Hash.verify(user.Password, password);
    if (!isPasswordValid) {
      return response.unauthorized({
        errorMessage: errorMessage.auth.invalidCredentials,
      });
    }

    // verified
    const token = await auth.use("api").generate(user);

    return {
      userStatus,
      token,
    };
  });
}).prefix("auth");
