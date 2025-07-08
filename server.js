import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import mongoose from "mongoose";

// Import routes
import authRoutes from "./src/routes/auth.js";
import inventoryRoutes from "./src/routes/inventory.js";
import orderRoutes from "./src/routes/orders.js";
import uploadRoutes from "./src/routes/upload.js";
// Only admin can get customers data
import { authorize, protect, isAdmin } from "./src/middleware/auth.js";
import authRoutesModule from "./src/routes/auth.js";
// import { Clerk } from "@clerk/clerk-sdk-node";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(morgan("dev"));

// Serve static files from the uploads directory
app.use("/uploads", express.static("uploads"));

// Upload route
app.use("/api/upload", uploadRoutes);

// Public routes
app.use("/api/auth", authRoutes);

app.use("/api/admin", protect, isAdmin, authRoutes);

// Protected routes
app.use("/api/products", inventoryRoutes);
app.use("/api/orders", protect, orderRoutes);

// Root route
app.get("/", (req, res) => {
  res.send("Welcome to the Furniture Store API");
});


app.use("*", (req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// MongoDB Connection with better error handling
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB Connected Successfully");
    console.log("Connection URI:", process.env.MONGODB_URI);
  })
  .catch((err) => {
    console.error("MongoDB Connection Error:", err);
    process.exit(1); // Exit if cannot connect to database
  });

// Handle MongoDB connection events
mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});

mongoose.connection.on("disconnected", () => {
  console.log("MongoDB disconnected");
});

// Handle process termination
process.on("SIGINT", async () => {
  await mongoose.connection.close();
  process.exit(0);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
