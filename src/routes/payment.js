import express from "express";
import {
  createOrder,
  verifyPayment,
} from "../controllers/paymentController.js";

const router = express.Router();

// Create Razorpay order
router.post("/order", createOrder);

// Verify Razorpay payment
router.post("/verify", verifyPayment);

export default router;
