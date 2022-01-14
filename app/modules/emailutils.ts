import Env from "@ioc:Adonis/Core/Env";
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(Env.get("SENDGRID_API_KEY"));

const from = {
  email: Env.get("SENDGRID_SENDER"),
  name: Env.get("SENDGRID_SENDER_NAME"),
};

export function sendEmail(
  recipient: string,
  subject: string,
  message: string
): boolean {
  let isSent = false;
  const msg = {
    to: recipient,
    from,
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
