import Route from "@ioc:Adonis/Core/Route";
import Env from "@ioc:Adonis/Core/Env";
import { DateTime } from "luxon";
import ErrorMessage from "App/modules/ErrorMessage";
import { generateCode } from "App/Modules/stringutils";
import { EmailUtils } from "App/Modules/emailutils";
import { validateEmail } from "App/Modules/validationutils";
import { UserType } from "App/Enums/UserType";
import PendingSignup from "App/Models/Redis/PendingSignup";
import User from "App/Models/User";
import Hash from "@ioc:Adonis/Core/Hash";
import Redis from "@ioc:Adonis/Addons/Redis";

Route.group(() => {
  Route.post("checkemail", async ({ request, response }) => {
    const email = request.input("email")?.toLowerCase().trim();
    const userType = parseInt(request.input("userType"));
    if (!Object.values(UserType).includes(userType)) {
      return response.badRequest();
    }
    if (!validateEmail(email))
      return response.badRequest(ErrorMessage.Auth.InvalidEmail);

    const matchedUser = await User.findBy("Email", email);
    const emailExists = !!matchedUser;
    if (!matchedUser) {
      return { emailExists };
    }

    if (matchedUser.UserTypeId !== userType) {
      return response.badRequest(ErrorMessage.Auth.PasswordTooShort);
    }
    return { emailExists };
  });

  Route.post("signup", async ({ request, response }) => {
    const email = request.input("email")?.toLowerCase().trim();
    const password = request.input("password");
    if (!validateEmail(email))
      return response.badRequest(ErrorMessage.Auth.InvalidEmail);
    if (password?.length < 6)
      return response.badRequest(ErrorMessage.Auth.PasswordTooShort);
    if (password?.length > 128)
      return response.badRequest(ErrorMessage.Auth.PasswordTooLong);
    const passwordHash = await Hash.make(password);
    const existingUser = await User.findBy("Email", email);
    if (!!existingUser) return response.conflict(ErrorMessage.Auth.EmailInUse);

    //Check if user has pending sign up on Redis
    const existingPendingSignup = await Redis.get(`signup:${email}`);
    if (!existingPendingSignup) {
      //Create pending sign up record on Redis, make it valid for code_expiry minutes
      const newUser = {
        email,
        password: passwordHash,
        code: generateCode(5),
        dateCreated: DateTime.utc().toMillis(),
      };
      Redis.set(`signup:${email}`, JSON.stringify(newUser));
      Redis.expire(
        `signup:${email}`,
        Env.get("VERIFICATION_CODE_EXPIRY_MINUTES") * 60
      );
      EmailUtils.sendSignupVerificationMail(email, newUser.code);
      return response.created();
    }
    //TODO Update user pending signup record if exists

    const existingSignup: PendingSignup = <PendingSignup>(
      JSON.parse(existingPendingSignup)
    );
    existingSignup.Password = passwordHash;
    Redis.expire(
      `signup:${email}`,
      Env.get("VERIFICATION_CODE_EXPIRY_MINUTES") * 60
    );
    if (
      existingSignup.DateCreated <
      DateTime.utc()
        .minus({ minutes: Env.get("VERIFICATION_CODE_COOLDOWN_MINUTES") })
        .toMillis()
    ) {
      Redis.set(`signup:${email}`, JSON.stringify(existingSignup));
      Redis.expire(
        `signup:${email}`,
        Env.get("VERIFICATION_CODE_EXPIRY_MINUTES")
      );
      return response.ok(null);
    }
    //otherwise send verification code
    existingSignup.Code = generateCode(5);
    existingSignup.DateCreated = DateTime.utc().toMillis();
    Redis.set(`signup:${email}`, JSON.stringify(existingSignup));
    Redis.expire(
      `signup:${email}`,
      Env.get("VERIFICATION_CODE_EXPIRY_MINUTES")
    );
    EmailUtils.sendSignupVerificationMail(email, existingSignup.Code);
  });

  Route.post("signin", async ({ auth, request, response }) => {
    const email = request.input("email")?.toLowerCase().trim();
    const password = request.input("password");

    //Find matching user
    const user = await User.findBy("Email", email);
    if (!user)
      return response.unauthorized(ErrorMessage.Auth.InvalidCredentials);

    //Get stuff from user
    const { UserStatusId: userStatus } = user;
    const isPasswordValid = await Hash.verify(user.Password, password);
    if (!isPasswordValid) {
      return response.unauthorized(ErrorMessage.Auth.InvalidCredentials);
    }

    // verified
    const token = await auth.use("api").generate(user);

    return {
      userStatus,
      token,
    };
  });

  Route.post("verify", async ({ auth, request, response }) => {
    const code = request.input("code");
    const email = request.input("email")?.toLowerCase().trim();

    const matchedSignup = await Redis.get(`signup:${email}`);
    if (!matchedSignup)
      return response.unauthorized(ErrorMessage.Auth.CodeInvalid);
  });
}).prefix("auth");
