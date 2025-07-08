import mongoose from "mongoose";

const customerSchema = new mongoose.Schema(
  {
    customer_name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    pincode: { type: String, required: true },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

export const Customer = mongoose.model("Customer", customerSchema);
export { customerSchema };
