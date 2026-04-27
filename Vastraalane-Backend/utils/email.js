import nodemailer from "nodemailer";

function resolveSmtpConfig() {
  const host = String(process.env.SMTP_HOST || "").trim();
  const port = Number(process.env.SMTP_PORT || 0);
  const user = String(process.env.SMTP_USER || process.env.EMAIL_USER || "").trim();
  const pass = String(process.env.SMTP_PASS || process.env.EMAIL_PASS || "").trim();
  const from = String(process.env.EMAIL_FROM || user || "").trim();
  const supportEmail = String(process.env.SUPPORT_EMAIL || from || "").trim();

  if (!host || !port || !user || !pass || !from || !supportEmail) {
    return null;
  }

  return {
    host,
    port,
    user,
    pass,
    from,
    supportEmail,
    secure: port === 465,
  };
}

let cachedTransporter = null;
let cachedConfigKey = "";

function getTransporter() {
  const smtpConfig = resolveSmtpConfig();
  if (!smtpConfig) {
    return null;
  }

  const configKey = JSON.stringify(smtpConfig);
  if (cachedTransporter && cachedConfigKey === configKey) {
    return { transporter: cachedTransporter, smtpConfig };
  }

  cachedTransporter = nodemailer.createTransport({
    host: smtpConfig.host,
    port: smtpConfig.port,
    secure: smtpConfig.secure,
    auth: {
      user: smtpConfig.user,
      pass: smtpConfig.pass,
    },
  });
  cachedConfigKey = configKey;

  return { transporter: cachedTransporter, smtpConfig };
}

function formatCurrency(value = 0) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number(value) || 0);
}

function escapeHtml(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function buildOrderItemsMarkup(items = []) {
  return items
    .map((item) => {
      const sizeLabel = item.size ? ` | Size: ${escapeHtml(item.size)}` : "";
      const colorLabel = item.color ? ` | Color: ${escapeHtml(item.color)}` : "";
      return `<li>${escapeHtml(item.name)} x ${Number(item.quantity) || 0} - ${formatCurrency(item.price)}${sizeLabel}${colorLabel}</li>`;
    })
    .join("");
}

function buildAddressMarkup(address = {}) {
  const lines = [
    address.name,
    address.street,
    [address.city, address.state, address.zip].filter(Boolean).join(", "),
    address.country,
    address.phone ? `Phone: ${address.phone}` : "",
  ].filter(Boolean);

  return lines.map((line) => `<div>${escapeHtml(line)}</div>`).join("");
}

function getCustomerEmail(order) {
  return String(order?.user?.email || "").trim();
}

function buildAdminOrderEmail(order) {
  const customerName = order?.shippingAddress?.name || order?.user?.name || "Customer";
  return {
    subject: `New paid order received - ${order._id}`,
    html: `
      <div style="font-family: Arial, sans-serif; color: #1f1a17;">
        <h2 style="margin-bottom: 12px;">New paid order received</h2>
        <p><strong>Order ID:</strong> ${escapeHtml(order._id)}</p>
        <p><strong>Customer:</strong> ${escapeHtml(customerName)}</p>
        <p><strong>Email:</strong> ${escapeHtml(getCustomerEmail(order) || "Not available")}</p>
        <p><strong>Payment Status:</strong> ${escapeHtml(order.paymentStatus || "paid")}</p>
        <p><strong>Total:</strong> ${formatCurrency(order.total)}</p>
        <p><strong>Shipping Method:</strong> ${escapeHtml(order.shippingMethod || "")}</p>
        <h3 style="margin-top: 20px;">Items</h3>
        <ul>${buildOrderItemsMarkup(order.items)}</ul>
        <h3 style="margin-top: 20px;">Shipping Address</h3>
        <div>${buildAddressMarkup(order.shippingAddress)}</div>
      </div>
    `,
  };
}

function buildCustomerOrderEmail(order) {
  const customerName = order?.shippingAddress?.name || order?.user?.name || "Customer";
  return {
    subject: `Order confirmed - ${order._id}`,
    html: `
      <div style="font-family: Arial, sans-serif; color: #1f1a17;">
        <h2 style="margin-bottom: 12px;">Your order is confirmed</h2>
        <p>Hi ${escapeHtml(customerName)},</p>
        <p>Thank you for shopping with Vastraalane. Your payment has been received and your order is now confirmed.</p>
        <p><strong>Order ID:</strong> ${escapeHtml(order._id)}</p>
        <p><strong>Total:</strong> ${formatCurrency(order.total)}</p>
        <p><strong>Shipping Method:</strong> ${escapeHtml(order.shippingMethod || "")}</p>
        <h3 style="margin-top: 20px;">Items</h3>
        <ul>${buildOrderItemsMarkup(order.items)}</ul>
        <p style="margin-top: 20px;">If you need help with your order, reply to this email or contact us at ${escapeHtml(resolveSmtpConfig()?.supportEmail || "")}.</p>
      </div>
    `,
  };
}

async function sendEmail({ to, subject, html }) {
  const mailer = getTransporter();
  if (!mailer) {
    return { skipped: true, reason: "SMTP is not fully configured" };
  }

  await mailer.transporter.sendMail({
    from: mailer.smtpConfig.from,
    to,
    subject,
    html,
  });

  return { skipped: false };
}

export async function sendOrderEmails(order) {
  const smtpConfig = resolveSmtpConfig();
  if (!smtpConfig) {
    return { skipped: true, reason: "SMTP is not fully configured" };
  }

  const adminEmail = smtpConfig.supportEmail;
  const customerEmail = getCustomerEmail(order);
  const jobs = [];

  if (adminEmail) {
    const adminMessage = buildAdminOrderEmail(order);
    jobs.push(sendEmail({ to: adminEmail, ...adminMessage }));
  }

  if (customerEmail) {
    const customerMessage = buildCustomerOrderEmail(order);
    jobs.push(sendEmail({ to: customerEmail, ...customerMessage }));
  }

  await Promise.all(jobs);
  return { skipped: false };
}
