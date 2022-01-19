import Route from "@ioc:Adonis/Core/Route";
import Env from "@ioc:Adonis/Core/Env";
import { validateEmail } from "App/Modules/validationutils";
import ErrorMessage from "App/Modules/ErrorMessage";
import { DateTime } from "luxon";
import { generateCode } from "App/Modules/stringutils";
import { EmailUtils } from "App/Modules/emailutils";
import Redis from "@ioc:Adonis/Addons/Redis";
import PendingSignup from "App/Models/Redis/PendingSignup";

Route.group(() => {
  Route.post("resend", async ({ request, response }) => {
    const email = request.input("email")?.toLowerCase().trim();
    if (!validateEmail(email)) return response.badRequest();
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
    signupRecord.Code = generateCode(
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
  });
}).prefix("email");
