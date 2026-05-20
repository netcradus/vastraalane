import { resolveOrderNotificationRecipient, sendEmail } from "./sendEmail.js";

function formatMoney(amount = 0) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(amount || 0) / 100);
}

function escapeHtml(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function buildAddress(address = {}) {
  return [
    address.name,
    address.street,
    address.city,
    address.state,
    address.zip,
    address.country,
    address.phone ? `Phone: ${address.phone}` : "",
  ]
    .filter(Boolean)
    .join("\n");
}

function buildOrderText(order, customer) {
  const address = order.shippingAddress || {};
  const lines = [
    `New order/payment started`,
    ``,
    `Order ID: ${order._id}`,
    `Payment status: ${order.paymentStatus}`,
    `Payment method: ${order.paymentMethod}`,
    `Razorpay order ID: ${order.razorpayOrderId || "N/A"}`,
    ``,
    `Customer`,
    `Name: ${customer?.name || address.name || "N/A"}`,
    `Email: ${customer?.email || "N/A"}`,
    `Phone: ${address.phone || "N/A"}`,
    ``,
    `Shipping address`,
    buildAddress(address),
    ``,
    `Items`,
    ...order.items.map(
      (item) =>
        `- ${item.name} x ${item.quantity} | Size: ${item.size || "N/A"} | Color: ${item.color || "N/A"} | Price: ${formatMoney(item.price)}`
    ),
    ``,
    `Subtotal: ${formatMoney(order.subtotal)}`,
    `Shipping: ${formatMoney(order.shippingCost)}`,
    `Discount: ${formatMoney(order.discount)}`,
    `Coupon: ${order.coupon || "N/A"}`,
    `Total: ${formatMoney(order.total)}`,
  ];

  return lines.join("\n");
}

function buildOrderHtml(order, customer) {
  const address = order.shippingAddress || {};
  const itemRows = order.items
    .map(
      (item) => `
        <tr>
          <td style="padding:8px;border-bottom:1px solid #eee;">${escapeHtml(item.name)}</td>
          <td style="padding:8px;border-bottom:1px solid #eee;">${escapeHtml(item.size || "N/A")}</td>
          <td style="padding:8px;border-bottom:1px solid #eee;">${escapeHtml(item.color || "N/A")}</td>
          <td style="padding:8px;border-bottom:1px solid #eee;text-align:center;">${item.quantity}</td>
          <td style="padding:8px;border-bottom:1px solid #eee;text-align:right;">${formatMoney(item.price)}</td>
        </tr>`
    )
    .join("");

  return `
    <div style="font-family:Arial,sans-serif;color:#222;line-height:1.5;">
      <h2 style="margin:0 0 12px;">New order/payment started</h2>
      <p><strong>Order ID:</strong> ${escapeHtml(order._id)}</p>
      <p><strong>Payment status:</strong> ${escapeHtml(order.paymentStatus)}<br/>
      <strong>Payment method:</strong> ${escapeHtml(order.paymentMethod)}<br/>
      <strong>Razorpay order ID:</strong> ${escapeHtml(order.razorpayOrderId || "N/A")}</p>

      <h3>Customer</h3>
      <p><strong>Name:</strong> ${escapeHtml(customer?.name || address.name || "N/A")}<br/>
      <strong>Email:</strong> ${escapeHtml(customer?.email || "N/A")}<br/>
      <strong>Phone:</strong> ${escapeHtml(address.phone || "N/A")}</p>

      <h3>Shipping address</h3>
      <p style="white-space:pre-line;">${escapeHtml(buildAddress(address))}</p>

      <h3>Items</h3>
      <table style="border-collapse:collapse;width:100%;max-width:760px;">
        <thead>
          <tr>
            <th style="padding:8px;border-bottom:2px solid #ddd;text-align:left;">Product</th>
            <th style="padding:8px;border-bottom:2px solid #ddd;text-align:left;">Size</th>
            <th style="padding:8px;border-bottom:2px solid #ddd;text-align:left;">Color</th>
            <th style="padding:8px;border-bottom:2px solid #ddd;text-align:center;">Qty</th>
            <th style="padding:8px;border-bottom:2px solid #ddd;text-align:right;">Price</th>
          </tr>
        </thead>
        <tbody>${itemRows}</tbody>
      </table>

      <h3>Totals</h3>
      <p><strong>Subtotal:</strong> ${formatMoney(order.subtotal)}<br/>
      <strong>Shipping:</strong> ${formatMoney(order.shippingCost)}<br/>
      <strong>Discount:</strong> ${formatMoney(order.discount)}<br/>
      <strong>Coupon:</strong> ${escapeHtml(order.coupon || "N/A")}<br/>
      <strong>Total:</strong> ${formatMoney(order.total)}</p>
    </div>
  `;
}

export async function sendOrderNotificationEmail(order, customer) {
  const to = resolveOrderNotificationRecipient();
  const orderCode = String(order._id).slice(-6).toUpperCase();

  return sendEmail({
    to,
    replyTo: customer?.email,
    subject: `New Vastraalane order #${orderCode}`,
    text: buildOrderText(order, customer),
    html: buildOrderHtml(order, customer),
  });
}
