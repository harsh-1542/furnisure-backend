import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    // Either existing customer or guest info
    customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" }, // optional for guest checkouts
    user_id: { type: String, ref: "ClerkUser" }, // Clerk user

    customer_name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },

    // Addressing
    address: { type: String, required: true },
    pincode: { type: String, required: true },
    delivery_instructions: { type: String },

    // Order summary
    total_amount: { type: Number, required: true },
    // tax_amount: { type: Number, default: 0 },
    // shipping_cost: { type: Number, default: 0 },
    // discount_amount: { type: Number, default: 0 },
    // discount_code: { type: String, default: null },

    // Payment
    payment_method: {
      type: String,
      enum: ["cod", "gateway"],
      required: true,
    },
    payment_status: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded", "unverified"],
      default: "pending",
    },
    razorpay_order_id: { type: String, default: null },
    payment_reference_id: { type: String, default: null },
    payment_error_message: { type: String, default: null },

    // Status
    status: {
      type: String,
      enum: ["new", "processing", "dispatched", "delivered", "cancelled"],
      default: "new",
    },

    // Order items
    items: [{ type: mongoose.Schema.Types.ObjectId, ref: "OrderItem" }],

    // Metadata / Audit
    // is_guest_checkout: { type: Boolean, default: false },
    ip_address: { type: String },
    // user_agent: { type: String },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

// const orderSchema = new mongoose.Schema(
//   {
//     customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" },
//     customer_name: String,
//     email: String,
//     phone: String,
//     address: String,
//     pincode: String,
//     total_amount: Number,
//     payment_method: { type: String, enum: ["cod", "gateway"] },
//     payment_status: {
//       type: String,
//       enum: ["pending", "paid"],
//       default: "pending",
//     },
//     delivery_instructions: { type: String },
//     payment_reference_id: { type: String, default: null },
//     user_id: { type: mongoose.Schema.Types.ObjectId, ref: "ClerkUser" },
//     status: {
//       type: String,
//       enum: ["new", "dispatched", "completed"],
//       default: "new",
//     },
//     items: [{ type: mongoose.Schema.Types.ObjectId, ref: "OrderItem" }],
//   },
//   {
//     timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
//   }
// );

const Order = mongoose.model("Order", orderSchema);

export { Order };
