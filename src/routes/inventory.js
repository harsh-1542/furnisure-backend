import express from "express";
import { protect, authorize, isAdmin } from "../middleware/auth.js";
import { validateInventory } from "../middleware/inventoryValidation.js";
import {
  getInventory,
  getInventoryById,
  createInventory,
  updateInventory,
  deleteInventory,
} from "../controllers/inventoryController.js";

const router = express.Router();

// @route   GET /api/inventory
// @desc    Get all inventory items
// @access  Public
router.get("/", getInventory);

// @route   GET /api/inventory/:id
// @desc    Get single inventory item
// @access  Public
router.get("/:id", getInventoryById);

// @route   POST /api/inventory
// @desc    Create inventory item
// @access  Private/Admin
router.post(
  "/",
  [protect, isAdmin, validateInventory],
  createInventory
);

// @route   PUT /api/inventory/:id
// @desc    Update inventory item
// @access  Private/Admin
router.put(
  "/:id",
  [protect, isAdmin, validateInventory],
  updateInventory
);

// @route   DELETE /api/inventory/:id
// @desc    Delete inventory item
// @access  Private/Admin
router.delete("/:id", [protect, isAdmin], deleteInventory);

export default router;
