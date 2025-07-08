import mongoose from "mongoose";

const clerkUserSchema = new mongoose.Schema(
  {
    clerkId: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    fullName: { type: String },
    phoneNumber: { type: String },
  },
  { timestamps: true }
);

const ClerkUser = mongoose.model("ClerkUser", clerkUserSchema);

export default ClerkUser;
