// controllers/razorpayController.js
require('dotenv').config();
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/RazorList'); // adjust path if needed

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

exports.createOrder = async (req, res) => {
  try {
    const { product, quantity = 1 } = req.body;
    if (!product) return res.status(400).json({ error: 'product required' });

    // Server-side amount calculation (paise)
    const amountInPaise = Math.round((product.price || 0) * 100 * Number(quantity));

    const options = {
      amount: amountInPaise,
      currency: 'INR',
      receipt: `rcpt_${Date.now()}`,
      payment_capture: 1
    };

    // Create Razorpay order (uncommented and used)
    // const rOrder = await razorpay.orders.create(options);

    // Build DB order and save
    const dbOrder = new Order({
      product,
      amount: amountInPaise,
      razorpay_order_id: 1,
      status: 'ORDER_CREATED'
    });

    await dbOrder.save();
console.log("test6")
    // Respond with data needed by the frontend
    return res.json({
      success: true,
      orderId: 1,
      amount: 100, // in paise
      currency: 'INR',
      key: process.env.RAZORPAY_KEY_ID,
      dbOrderId: dbOrder._id
    });

  } catch (err) {
    console.error('createOrder error:', err);
    // Return either a 400 or 500 depending on error; keep generic message but log details
    return res.status(500).json({ error: 'create-order-failed', detail: err.message });
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      dbOrderId,
      user // optional
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Missing payment data' });
    }

    const generated_signature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + '|' + razorpay_payment_id)
      .digest('hex');

    if (generated_signature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Invalid signature' });
    }

    const order = await Order.findOne({ _id: dbOrderId, razorpay_order_id: razorpay_order_id });
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    order.razorpay_payment_id = razorpay_payment_id;
    order.razorpay_signature = razorpay_signature;
    order.status = 'PAID';
    if (user) order.user = user;
    await order.save();

    return res.json({ success: true, orderId: order._id });
  } catch (err) {
    console.error('verifyPayment error:', err);
    return res.status(500).json({ success: false, message: 'verification-failed', detail: err.message });
  }
};
