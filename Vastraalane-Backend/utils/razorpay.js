import crypto from "crypto";

const apiBase = "https://api.razorpay.com/v1";

export function isMockPaymentEnabled() {
  const explicitMockSetting = process.env.MOCK_PAYMENT_ENABLED;
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (String(explicitMockSetting || "").toLowerCase() === "true") {
    return true;
  }

  return !keyId || !keySecret || keyId === keySecret;
}

function getCredentials() {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    throw new Error("Razorpay credentials are not configured");
  }

  if (keyId === keySecret) {
    throw new Error("Razorpay credentials are invalid: key ID and key secret cannot be the same");
  }

  return { keyId, keySecret };
}

function getAuthHeader() {
  const { keyId, keySecret } = getCredentials();
  return `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString("base64")}`;
}

export async function createRazorpayOrder({ amount, receipt, notes = {} }) {
  if (isMockPaymentEnabled()) {
    return {
      id: `mock_order_${Date.now()}`,
      amount,
      currency: "INR",
      receipt,
      notes,
      mock: true,
    };
  }

  const response = await fetch(`${apiBase}/orders`, {
    method: "POST",
    headers: {
      Authorization: getAuthHeader(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount,
      currency: "INR",
      receipt,
      notes,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.error?.description || "Failed to create Razorpay order");
  }

  return data;
}

export function verifyRazorpaySignature({ razorpayOrderId, razorpayPaymentId, razorpaySignature }) {
  if (isMockPaymentEnabled()) {
    return true;
  }

  const { keySecret } = getCredentials();
  const expectedSignature = crypto
    .createHmac("sha256", keySecret)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest("hex");

  return expectedSignature === razorpaySignature;
}

export function getRazorpayPublicConfig() {
  if (isMockPaymentEnabled()) {
    return { keyId: "mock_razorpay_key", mock: true };
  }

  const { keyId } = getCredentials();
  return { keyId };
}
