import express from "express";
import { check } from "express-validator";
import {
  register,
  login,
  profile,
  checkEmail,
  fetchAllCustomers,
} from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";
import { syncClerkUser } from "../controllers/clerkUserController.js";
import { getProfileOrders } from "../controllers/orderController.js";

const router = express.Router();

// Validation middleware
const registerValidation = [
  check("name", "Name is required").not().isEmpty(),
  check("email", "Please include a valid email").isEmail(),
  check(
    "password",
    "Please enter a password with 6 or more characters"
  ).isLength({ min: 6 }),
];

const loginValidation = [
  check("email", "Please include a valid email").isEmail(),
  check("password", "Password is required").exists(),
];

// Routes
// router.post("/register", registerValidation, register);
// router.post("/login", loginValidation, login);
router.get("/profile", protect, profile);
router.get("/profile/orders", protect, getProfileOrders);
router.post("/check-email", checkEmail);
router.get("/customers", fetchAllCustomers);
router.post("/users/sync", syncClerkUser);

export default router;
