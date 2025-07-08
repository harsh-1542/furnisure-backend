import { OrderItem } from "../models/OrderItem.js";

// Create a new order item
export const createOrderItem = async (req, res) => {
  try {
    const orderItem = new OrderItem(req.body);
    const savedOrderItem = await orderItem.save();
    res.status(201).json(savedOrderItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all order items
export const getOrderItems = async (req, res) => {
  try {
    const orderItems = await OrderItem.find()
      .populate("order")
      .populate("product");
    res.status(200).json(orderItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get order items by order ID
export const getOrderItemsByOrder = async (req, res) => {
  try {
    const orderItems = await OrderItem.find({
      order: req.params.orderId,
    }).populate("product");
    res.status(200).json(orderItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single order item by ID
export const getOrderItem = async (req, res) => {
  try {
    const orderItem = await OrderItem.findById(req.params.id)
      .populate("order")
      .populate("product");
    if (!orderItem) {
      return res.status(404).json({ message: "Order item not found" });
    }
    res.status(200).json(orderItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update an order item
export const updateOrderItem = async (req, res) => {
  try {
    const orderItem = await OrderItem.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!orderItem) {
      return res.status(404).json({ message: "Order item not found" });
    }
    res.status(200).json(orderItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete an order item
export const deleteOrderItem = async (req, res) => {
  try {
    const orderItem = await OrderItem.findByIdAndDelete(req.params.id);
    if (!orderItem) {
      return res.status(404).json({ message: "Order item not found" });
    }
    res.status(200).json({ message: "Order item deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
