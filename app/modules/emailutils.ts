import Env from "@ioc:Adonis/Core/Env";
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(Env.get("SENDGRID_API_KEY"));

export function sendEmail(
  recipient: string,
  subject: string,
  message: string
): boolean {
  let isSent = false;
  const msg = {
    to: recipient,
    from: Env.get("SENDGRID_SENDER"),
    subject,
    text: message,
    html: message,
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

export function sendSignupVerificationMail(
  recipient: string,
  code: string
): boolean {
  let isSent = false;
  const msg = {
    to: recipient,
    from: Env.get("SENDGRID_SENDER"),
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
