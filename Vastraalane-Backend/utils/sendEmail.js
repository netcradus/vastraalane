import nodemailer from "nodemailer";

let cachedTransporter;

function getSmtpConfig() {
  const user = process.env.SMTP_USER_NAME || process.env.SMTP_USER || process.env.EMAIL_USER;
  const pass = process.env.SMTP_PASSWORD || process.env.SMPT_PASSWORD || process.env.EMAIL_PASS;

  if (!user || !pass) {
    return null;
  }

  return {
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT || 465),
    secure: String(process.env.SMTP_SECURE || "true").toLowerCase() !== "false",
    auth: { user, pass },
  };
}

function getTransporter() {
  if (cachedTransporter) {
    return cachedTransporter;
  }

  const config = getSmtpConfig();
  if (!config) {
    return null;
  }

  cachedTransporter = nodemailer.createTransport(config);
  return cachedTransporter;
}

export function resolveOrderNotificationRecipient() {
  return (
    process.env.ORDER_NOTIFICATION_EMAIL ||
    process.env.SUPPORT_EMAIL ||
    process.env.EMAIL_USER ||
    process.env.SMTP_USER_NAME ||
    process.env.SMTP_USER
  );
}

export async function sendEmail({ to, subject, text, html, replyTo }) {
  const transporter = getTransporter();
  const fromAddress = process.env.MAIL_FROM || process.env.SMTP_USER_NAME || process.env.SMTP_USER || process.env.EMAIL_USER;

  if (!transporter || !fromAddress || !to) {
    console.warn("Email not sent because SMTP configuration is incomplete.");
    return { skipped: true };
  }

  return transporter.sendMail({
    from: process.env.MAIL_FROM_NAME ? `"${process.env.MAIL_FROM_NAME}" <${fromAddress}>` : fromAddress,
    to,
    subject,
    text,
    html,
    replyTo,
  });
}
