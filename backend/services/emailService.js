const nodemailer = require("nodemailer");
const env = require("../config/env");

const transporter =
  env.smtpHost && env.smtpUser && env.smtpPass
    ? nodemailer.createTransport({
        host: env.smtpHost,
        port: env.smtpPort,
        secure: env.smtpPort === 465,
        auth: {
          user: env.smtpUser,
          pass: env.smtpPass,
        },
      })
    : nodemailer.createTransport({
        jsonTransport: true,
      });

const sendEmail = async ({ to, subject, html }) => {
  const info = await transporter.sendMail({
    from: env.smtpFrom,
    to,
    subject,
    html,
  });

  // eslint-disable-next-line no-console
  console.log("Email sent:", info.messageId || info);
};

module.exports = {
  sendEmail,
};
