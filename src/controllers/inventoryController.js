import { Product } from "../models/Inventory.js";

// Get all inventory
export const getInventory = async (req, res) => {
  try {
    const inventory = await Product.find().sort({ createdAt: -1 });
    res.status(200).json(inventory);
  } catch (error) {
    console.error("Error fetching inventory:", error);
    res
      .status(500)
      .json({ message: "Error fetching inventory", error: error.message });
  }
};

// Get inventory by ID
export const getInventoryById = async (req, res) => {
  try {
    const inventory = await Product.findById(req.params.id);
    if (!inventory) {
      return res.status(404).json({ message: "Inventory not found" });
    }
    res.status(200).json(inventory);
  } catch (error) {
    console.error("Error fetching inventory:", error);
    res
      .status(500)
      .json({ message: "Error fetching inventory", error: error.message });
  }
};

// Create new inventory
export const createInventory = async (req, res) => {
  try {
    // Check if all required fields are present
    const requiredFields = [
      "name",
      "price",
      "image",
      "brand",
      "assembly",
      "dimensions_cm",
      "dimensions_inches",
      "primary_material",
      "room_type",
      "storage",
      "warranty",
      "weight",
      "category",
      "description",
    ];

    console.log(req.body);

    const missingFields = requiredFields.filter((field) => !req.body[field]);

    if (missingFields.length > 0) {
      return res.status(400).json({
        message: "Missing required fields",
        missingFields: missingFields,
      });
    }

    // Validate numeric fields
    if (isNaN(req.body.price) || req.body.price <= 0) {
      return res.status(400).json({
        message: "Price must be a positive number",
      });
    }

    if (req.body.seating_height && isNaN(req.body.seating_height)) {
      return res.status(400).json({
        message: "Seating height must be a number",
      });
    }

    const inventory = new Product(req.body);
    await inventory.save();
    res.status(201).json(inventory);
  } catch (error) {
    console.error("Error creating inventory:", error);
    res
      .status(500)
      .json({ message: "Error creating inventory", error: error.message });
  }
};

// Update inventory
export const updateInventory = async (req, res) => {
  try {
    const inventory = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    if (!inventory) {
      return res.status(404).json({ message: "Inventory not found" });
    }
    res.status(200).json(inventory);
  } catch (error) {
    console.error("Error updating inventory:", error);
    res
      .status(500)
      .json({ message: "Error updating inventory", error: error.message });
  }
};

// Delete inventory
export const deleteInventory = async (req, res) => {
  try {
    const id = req.params.id;

    // console.log('===============req id=====================');
    // console.log(id ," ++++++ ", req.params.id);
    // console.log('====================================');
    const inventory = await Product.findByIdAndDelete(id);
    if (!inventory) {
      return res.status(404).json({ message: "Inventory not found" });
    }
    res.status(200).json({ message: "Inventory deleted successfully" });
  } catch (error) {
    console.error("Error deleting inventory:", error);
    res
      .status(500)
      .json({ message: "Error deleting inventory", error: error.message });
  }
};
