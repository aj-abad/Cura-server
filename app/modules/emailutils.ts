import Env from "@ioc:Adonis/Core/Env";
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(Env.get("SENDGRID_API_KEY"));

const from = {
  email: Env.get("SENDGRID_SENDER"),
  name: Env.get("SENDGRID_SENDER_NAME"),
};

export class EmailUtils {
  public static sendSignupVerificationMail(
    recipient: string,
    code: string
  ): boolean {
    let isSent: boolean = false;
    const msg = {
      to: recipient,
      from,
      templateId: "d-9e13297c99504d71ae41dea203a38c88",
      dynamicTemplateData: {
        code,
      },
    };
    sgMail
      .send(msg)
      .then(() => {
        isSent = true;
      })
      .catch((error) => {
        console.log(error);
      });
    return isSent;
  }
}
