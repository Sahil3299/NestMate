// backend/src/utils/sendEmail.js
const nodemailer = require("nodemailer");
const logger     = require("./logger");

const createTransporter = () =>
  nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || "2525"),
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });

const sendEmail = async ({ to, subject, html }) => {
  if (process.env.NODE_ENV === "test") return; // Skip in tests
  const transporter = createTransporter();
  const info = await transporter.sendMail({
    from: `"${process.env.FROM_NAME}" <${process.env.FROM_EMAIL}>`,
    to, subject, html,
  });
  logger.info(`Email sent → ${to} [${info.messageId}]`);
};

module.exports = sendEmail;
