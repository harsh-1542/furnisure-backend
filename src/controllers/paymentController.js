import Razorpay from "razorpay";
import crypto from "crypto";


const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

export const createOrder = async (req, res) => {
  try {
    const { amount, currency = "INR", receipt } = req.body;
    const options = {
      amount: amount * 100, // amount in the smallest currency unit
      currency,
      receipt,
    };
    const order = await razorpayInstance.orders.create(options);
    res.status(201).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const verifyPayment = (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;
  const sign = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_SECRET)
    .update(sign.toString())
    .digest("hex");
  if (expectedSignature === razorpay_signature) {
    res
      .status(200)
      .json({ success: true, message: "Payment verified successfully" });
  } else {
    res
      .status(400)
      .json({
        success: false,
        message: "Invalid signature",
        payment_error_message: "Invalid signature",
      });
  }
};
