import { check } from "express-validator";
import User from "../models/User.js";
import ClerkUser from "../models/ClerkUser.js";

// @desc    Register user
// @access  Public
export const register = async (req, res) => {
  try {
    const { email, password, fullName } = req.body;

    // Check if user exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create user
    user = await User.create({
      name: fullName,
      email,
      password,
    });

    // Create token
    const token = user.getSignedJwtToken();

    res.status(201).json({
      token,
      user: {
        id: user._id,
        email: user.email,
        fullName: user.name,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Login user
// @access  Public
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Create token
    const token = user.getSignedJwtToken();

    // Determine isAdmin property for frontend
    const isAdmin = user.role === "admin" || user.isAdmin === true;

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        fullName: user.name,
        isAdmin: isAdmin,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message:
        error?.response?.data?.message || "An error occurred during sign in",
    });
  }
};

// @desc    Get current user profile
// @access  Private
export const profile = async (req, res) => {
  try {
    const user = await ClerkUser.findOne({ clerkId: req.user.id });
    console.log('====================================');
    console.log(user);
    console.log('====================================');

    // Determine isAdmin property for frontend
    const isAdmin = user.role === "admin" || user.isAdmin === true;

    res.json({
      _id: user.id,
      clerkId: user.clerkId,
      __v: user.__v,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      email: user.email,
      fullName: user.fullName || user.name,
      phoneNumber: user.phoneNumber,
      isAdmin: isAdmin,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Check if email exists
// @access  Public
export const checkEmail = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    res.json({
      exists: !!user,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Fetch all customers (users with role 'user')
export const fetchAllCustomers = async (req, res) => {
  try {
    console.log("====================================");
    console.log("fetching all customers");
    console.log("====================================");
    const customers = await ClerkUser.find();

    console.log("========customers============================");
    console.log(customers);
    console.log("====================================");
    res.json(customers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
