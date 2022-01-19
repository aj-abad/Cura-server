import Route from "@ioc:Adonis/Core/Route";
import Env from "@ioc:Adonis/Core/Env";
import { validateEmail } from "App/modules/validationutils";
import { errorMessage } from "App/modules/errormessages";
import PendingSignup from "App/Models/PendingSignup";
import { DateTime } from "luxon";
import { generateCode } from "App/modules/stringutils";
import { EmailUtils } from "App/modules/emailutils";

Route.group(() => {
  Route.post("resend", async ({ request, response }) => {
    const email = request.input("email")?.toLowerCase().trim();
    if (!validateEmail(email))
      return response.badRequest({
        errorMessage: errorMessage.auth.invalidEmail,
      });
    //TODO test this
    const pendingSignup = await PendingSignup.findBy("Email", email);
    if (!pendingSignup) return null;
    const codeSentSince = DateTime.utc()
      .minus({ minutes: Env.get("VERIFICATION_CODE_COOLDOWN_MINUTES") })
      .toMillis();

    if (pendingSignup.DateCreated.toMillis() < codeSentSince) {
      const timeRemaining = Math.round(
        (DateTime.now().toMillis() - codeSentSince) / 1000
      );
      return response.tooManyRequests({
        errorMessage: `Please try again in ${timeRemaining} minutes.`,
      });
    }
    pendingSignup.Code = generateCode(5);
    pendingSignup.DateCreated = DateTime.now();
    await pendingSignup.save();
    EmailUtils.sendSignupVerificationMail(
      pendingSignup.Email,
      pendingSignup.Code
    );
    return response.ok(null);
  });
}).prefix("email");
