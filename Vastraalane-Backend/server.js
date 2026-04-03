try {
  require("dotenv").config();
} catch (error) {
  if (error.code !== "MODULE_NOT_FOUND") {
    throw error;
  }
  console.warn("dotenv not installed; using platform environment variables");
}
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const nodemailer = require("nodemailer");
const app = express();

const crypto = require('crypto');
const bodyParser = require('body-parser');
const razorpayController = require('./controllers/razorPayController');



// Middleware
app.use(express.json());

const allowedOrigins = [
  'http://localhost:3000',
  'https://vastraalane-frontend-ek42.vercel.app',
  'https://www.vastraalane.com',
  'https://vastraalane.com'
];


app.use(cors({
  origin: "*", // allow all origins
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: false // must be false when using '*' as origin
}));
app.use((req, res, next) => {
  console.log("Request Origin:", req.headers.origin);
  next();
});


// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.log("❌ MongoDB connection error:", err));





// Nodemailer setup
const transporter = nodemailer.createTransport({
  host: "smtpout.secureserver.net", // GoDaddy SMTP
  port: 587,                         // Use 465 for SSL or 587 for TLS
  secure: false,                     // TLS (STARTTLS)
  auth: {
    user: process.env.EMAIL_USER,   // e.g., info@vastraalane.com
    pass: process.env.EMAIL_PASS    // Use secure storage!
  },
  tls: {
    rejectUnauthorized: false        // Optional: helps with GoDaddy certs
  }
});

function sendOrderEmail(customer, product) {
  const products = Array.isArray(product) ? product : [product];
 
  const productRows = products
    .map(
      (p) => `
<tr>
<td style="border: 1px solid #ddd;">${p.name}</td>
<td style="border: 1px solid #ddd;">₹${p.price}</td>
</tr>
    `
    )
    .join("");
 
  // ✅ Common email HTML
  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<title>Order Confirmation</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
<table width="600" cellpadding="0" cellspacing="0" style="margin: auto; background: #ffffff; border: 1px solid #ddd; border-radius: 8px;">
<tr>
<td style="background: #4CAF50; color: #fff; padding: 15px; text-align: center; font-size: 20px; border-radius: 8px 8px 0 0;">
          Order Confirmation
</td>
</tr>
<tr>
<td style="padding: 20px;">
<h3 style="margin: 0 0 10px 0;">Customer Details</h3>
<p style="margin: 5px 0;"><strong>Name:</strong> ${customer.name}</p>
<p style="margin: 5px 0;"><strong>Email:</strong> ${customer.email}</p>
<p style="margin: 5px 0;"><strong>Contact:</strong> ${customer.contact}</p>
<p style="margin: 5px 0;"><strong>Address:</strong> ${customer.address}</p>
 
          <hr style="margin: 20px 0;" />
 
          <h3 style="margin: 0 0 10px 0;">Products Ordered</h3>
<table width="100%" cellpadding="8" cellspacing="0" style="border: 1px solid #ddd; border-collapse: collapse;">
<tr style="background: #f1f1f1;">
<th align="left" style="border: 1px solid #ddd;">Product Name</th>
<th align="left" style="border: 1px solid #ddd;">Price</th>
</tr>
            ${productRows}
</table>
 
          <p style="margin-top: 20px; font-size: 14px; color: #555;">
            Thank you for your order! We will process it shortly.
</p>
</td>
</tr>
<tr>
<td style="background: #f1f1f1; padding: 10px; text-align: center; font-size: 12px; color: #777; border-radius: 0 0 8px 8px;">
&copy; 2025 Vastralane
</td>
</tr>
</table>
</body>
</html>
  `;
 
  // ✅ Email to support team
  const adminMailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.SUPPORT_EMAIL || process.env.EMAIL_USER,
    subject: `New Order from ${customer.name}`,
    html: htmlContent,
  };
 
  // ✅ Email to customer
  const customerMailOptions = {
    from: process.env.EMAIL_USER,   // your business email
    to: customer.email,             // customer's email
    subject: "Your Order Confirmation - Vastralane",
    html: htmlContent,
  };
 
  // Send to admin
  transporter.sendMail(adminMailOptions, (error, info) => {
    if (error) {
      console.error("❌ Error sending admin email:", error);
    } else {
      console.log("✅ Admin email sent:", info.response);
    }
  });
 
  // Send to customer
  transporter.sendMail(customerMailOptions, (error, info) => {
    if (error) {
      console.error("❌ Error sending customer email:", error);
    } else {
      console.log("✅ Customer email sent:", info.response);
    }
  });
}

// Email route
app.post("/submit-order", (req, res) => {
  const { customer, product } = req.body;

  if (!customer || !product) {
    return res.status(400).json({ message: "Missing customer or product details." });
  }

  sendOrderEmail(customer, product);
  res.status(200).json({ message: "Order received and email sent." });
});

// Routes
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

const wishlistRoutes = require("./routes/wishlistRoutes");
app.use("/wishlist", wishlistRoutes);

const cartRoutes = require("./routes/cartRoutes");
app.use("/api/cart", cartRoutes);

const orderRoutes = require("./routes/razorPay");
app.use("/api/order", orderRoutes);

const productRoutes = require("./routes/productRoutes");
app.use("/api/products", productRoutes);


// const razorpayRoutes = require("./routes/razorPay");
// app.use("/api/razorpay", razorpayRoutes);

// Health check
app.get("/", (req, res) => res.send("API is running..."));


// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
