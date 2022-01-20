import Redis from "@ioc:Adonis/Addons/Redis";
import Validation from "App/Modules/Validation";
import Env from "@ioc:Adonis/Core/Env";
import { DateTime } from "luxon";
import ErrorMessage from "App/Modules/ErrorMessage";
import StringHelpers from "App/Modules/StringHelpers";
import EmailUtils from "App/Modules/EmailUtils";
import PendingSignup from "App/Models/Redis/PendingSignup";

export default class EmailsController {
  public async resendVerificationMail({ request, response }) {
    const email = request.input("email")?.toLowerCase().trim();
    if (!Validation.validateEmail(email)) return response.badRequest();
    //TODO test this

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
    await Redis.set(signupKey, JSON.stringify(signupRecord));
    Redis.expire(
      signupKey,
      (Env.get("VERIFICATION_CODE_EXPIRY_MINUTES") as number) * 60
    );
    //send email
    EmailUtils.sendSignupVerificationMail(email, signupRecord.Code);
  }
}
