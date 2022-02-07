import Redis from "@ioc:Adonis/Addons/Redis";
import Env from "@ioc:Adonis/Core/Env";
import { DateTime } from "luxon";
import ErrorMessage from "App/Modules/ErrorMessage";
import StringHelpers from "App/Modules/StringHelpers";
import EmailUtils from "App/Modules/EmailUtils";
import PendingSignup from "App/Models/Redis/PendingSignup";
import User from "App/Models/User";
import {validateEmail} from "cura-validation-utils";

export default class EmailsController {
  public async resendVerificationMail({ request, response }) {
    const email = request.input("email")?.toLowerCase().trim();
    if (!validateEmail(email)) return response.badRequest();
    const signupKey = `signup:${email}`;
    const record = await Redis.get(signupKey);
    if (!record) return response.notFound();

    const codeCooldown = Env.get(
      "VERIFICATION_CODE_COOLDOWN_MINUTES"
    ) as number;
    const signupRecord = <PendingSignup>JSON.parse(record);
    const isSentWithinCooldown =
      DateTime.utc().toMillis() - signupRecord.DateCreated <
      codeCooldown * 60 * 1000;

    //If code was sent recently return too many requests
    if (isSentWithinCooldown) {
      const secondsBeforeResend = Math.round(
        codeCooldown * 60 -
          (DateTime.utc().toMillis() - signupRecord.DateCreated) / 1000
      );
      return response.tooManyRequests(
        ErrorMessage.Email.ResendCode(secondsBeforeResend)
      );
    }

    //update redis record
    signupRecord.Code = StringHelpers.generateCode(
      Env.get("VERIFICATION_CODE_LENGTH") as number
    );
    signupRecord.DateCreated = DateTime.utc().toMillis();
    await Redis.set(
      signupKey,
      JSON.stringify(signupRecord),
      "EX",
      (Env.get("VERIFICATION_CODE_EXPIRY_MINUTES") as number) * 60
    );
    //send email
    EmailUtils.sendSignupVerificationMail(email, signupRecord.Code);
  }
  public async sendPasswordResetMail({ request, response }) {
    const email = request.input("email");
    const user = await User.findBy("email", email);
    if (!user) return response.badRequest(ErrorMessage.Email.EmailNotFound);
    const passwordResetValidityMinutes = Env.get(
      "PASSWORD_RESET_VALIDITY_MINUTES"
    ) as number;

    //Check if user has a pending password reset request
    const existingPasswordResetCode = await Redis.get(`passwordReset:${email}`);
    if (existingPasswordResetCode) {
      const existingPasswordReset = <PendingSignup>(
        JSON.parse(existingPasswordResetCode)
      );
      if (
        DateTime.utc().toMillis() - existingPasswordReset.DateCreated <
        passwordResetValidityMinutes * 60 * 1000
      )
        return response.ok(null);
    }

    const code = StringHelpers.generatePasswordResetPhrase();
    const passwordReset = new PendingSignup({
      Email: email,
      Code: code,
      DateCreated: DateTime.utc().toMillis(),
    });
    await Redis.set(
      `passwordReset:${email}`,
      JSON.stringify(passwordReset),
      "EX",
      passwordResetValidityMinutes * 60
    );
    //TODO send email
  }
}
