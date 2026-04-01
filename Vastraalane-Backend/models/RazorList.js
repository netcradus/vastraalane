// models/RazorList.js
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { name: String, email: String, phone: String },
  product: { type: Object, required: true },
  amount: { type: Number, required: true }, // in paise
  currency: { type: String, default: 'INR' },
  razorpay_order_id: { type: String },
  razorpay_payment_id: { type: String },
  razorpay_signature: { type: String },
  status: { type: String, default: 'CREATED' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('RazorList', orderSchema); // name matches file you required
