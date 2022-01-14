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
    from: "cura.app.ph@gmail.com",
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
