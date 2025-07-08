import express from "express";
import { protect, authorize } from "../middleware/auth.js";
import {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
} from "../controllers/orderController.js";
import { Order } from "../models/Order.js";
import { OrderItem } from "../models/OrderItem.js";

const router = express.Router();

// @route   GET /api/orders
// @desc    Get all orders (admin) or user's orders
// @access  Private
router.get("/", getAllOrders);

// @route   GET /api/orders/:id
// @desc    Get single order
// @access  Private
router.get("/:id", getOrderById);

// @route   POST /api/orders
// @desc    Create new order
// @access  Private
router.post("/", createOrder);

// @route   PUT /api/orders/:id/status
// @desc    Update order status
// @access  Private/Admin
router.put("/:id/status", [protect, authorize("admin")], updateOrderStatus);

// router.post("/orders", async (req, res) => {
//   try {
//     const {
//       customer_name,
//       email,
//       phone,
//       address,
//       pincode,
//       total_amount,
//       items,
//     } = req.body;

//     // 1. Create the order
//     const newOrder = await Order.create({
//       customer_name,
//       email,
//       phone,
//       address,
//       pincode,
//       total_amount,
//       status: "new",
//       created_at: new Date(),
//       updated_at: new Date(),
//     });

//     // 2. Create order items
//     const orderItems = await Promise.all(
//       items.map((item) =>
//         OrderItem.create({
//           order_id: newOrder._id,
//           product_id: item.product_id,
//           quantity: item.quantity,
//           price: item.price,
//           selected_set: item.selected_set,
//           created_at: new Date(),
//         })
//       )
//     );

//     res.status(201).json({ ...newOrder.toObject(), items: orderItems });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

export default router;
