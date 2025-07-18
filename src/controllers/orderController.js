import { Order } from "../models/Order.js";
import { OrderItem } from "../models/OrderItem.js";
import { Product } from "../models/Inventory.js";
import { Customer } from "../models/Customer.js";
// import { User } from "../models/User.js";
import ClerkUser from "../models/ClerkUser.js";

// Helper function to format order data for frontend
const formatOrderForFrontend = (order) => {
  return {
    id: order._id.toString(),
    user_id: order.user_id || "",
    customer_name: order.customer_name || "",
    email: order.email || "",
    phone: order.phone || "",
    address: order.address || "",
    pincode: order.pincode || "",
    delivery_instructions: order.delivery_instructions || "",
    total_amount: order.total_amount,
    payment_method: order.payment_method,
    payment_status: order.payment_status,
    payment_reference_id: order.payment_reference_id || "",
    razorpay_order_id: order.razorpay_order_id || "",
    payment_error_message: order.payment_error_message || "",
    status: order.status,
    created_at: order.created_at,
    updated_at: order.updated_at,
    items: (order.items || []).map((item) => ({
      id: item._id.toString(),
      order: order._id.toString(),
      product_id: item.product?._id?.toString() || "",
      quantity: item.quantity,
      price: item.price,
      selected_set: !!item.selected_set,
      created_at: item.created_at,
      product: item.product
        ? {
            id: item.product._id.toString(),
            name: item.product.name,
            price: item.product.price,
            image: item.product.image,
            brand: item.product.brand,
            category: item.product.category,
            description: item.product.description,
          }
        : null,
    })),
  };
};

// Get all orders (admin or user's orders)
export const getAllOrders = async (req, res) => {
  try {
    let orders;

    // console.log("====================================");
    // console.log(req.user);
    // console.log("====================================");
    if (req.user.isAdmin) {
      orders = await Order.find().populate({
        path: "items",
        populate: {
          path: "product",
          select: "name price image brand category description",
        },
      });
    } else {
      orders = await Order.find({ user_id: req.user.id }).populate({
        path: "items",
        populate: {
          path: "product",
          select: "name price image brand category description",
        },
      });
    }

    // console.log("============orderesss========================");
    // console.log(orders);
    // console.log("====================================");
    // Transform the data to match frontend format
    const formattedOrders = orders.map(formatOrderForFrontend);

    // console.log("=========formatedd orders ===========================");
    // console.log(formattedOrders);
    // console.log("====================================");
    res.json(formattedOrders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
// export const getAllOrders = async (req, res) => {
//   try {
//     let orders;

//     console.log('====================================');
//     console.log(req.user);
//     console.log('====================================');
//     if (req.user.isAdmin) {
//       orders = await Order.find()
//         .populate({
//           path: "customer",
//           select: "customer_name email phone address pincode",
//         })
//         .populate({
//           path: "items",
//           populate: {
//             path: "product",
//             select: "name price image brand category description",
//           },
//         });
//     } else {
//       orders = await Order.find({user_id: req.user.id })
//         .populate({
//           path: "items",
//           populate: {
//             path: "product",
//             select: "name price image brand category description",
//           },
//         });
//     }

//     // Transform the data to match frontend format
//     const formattedOrders = orders.map(formatOrderForFrontend);

//     console.log("====================================");
//     console.log(formattedOrders);
//     console.log("====================================");
//     res.json(formattedOrders);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// Get single order by ID
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate({
      path: "items",
      populate: {
        path: "product",
        select: "name price image brand category description",
      },
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Check if user is admin or order owner
    if (req.user.role !== "admin" && order.user?.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const formattedOrder = formatOrderForFrontend(order);
    res.json(formattedOrder);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Create a new order
 * @param {Object} orderData
 * @param {string} orderData.customer_name
 * @param {string} orderData.email
 * @param {string} orderData.phone
 * @param {string} orderData.address
 * @param {string} orderData.pincode
 * @param {number} orderData.total_amount
 * @param {'cod'|'gateway'} orderData.payment_method
 * @param {'pending'|'paid'|'failed'|'unverified'} orderData.payment_status
 * @param {Array<{product_id: string, quantity: number, price: number, selected_set: boolean}>} orderData.items
 * @param {string} [orderData.delivery_instructions]
 * @param {string|null} [orderData.payment_reference_id]
 * @param {string|null} [orderData.razorpay_order_id]
 * @param {string} [orderData.user_id]
 * @param {string} orderData.ip_address
 * @param {string|null} [orderData.payment_error_message]
 */
export const createOrder = async (req, res) => {
  try {
    /** @type {{
      customer_name: string;
      email: string;
      phone: string;
      address: string;
      pincode: string;
      total_amount: number;
      payment_method: 'cod' | 'gateway';
      payment_status: 'pending' | 'paid' | 'failed' | 'unverified';
      items: Array<{ product_id: string; quantity: number; price: number; selected_set: boolean; }>;
      delivery_instructions?: string;
      payment_reference_id?: string | null;
      razorpay_order_id?: string | null;
      user_id?: string;
      ip_address: string;
      payment_error_message?: string | null;
    }} */
    const {
      customer_name,
      email,
      phone,
      address,
      pincode,
      total_amount,
      payment_method,
      payment_status,
      items,
      delivery_instructions = "",
      payment_reference_id = null,
      razorpay_order_id = null,
      user_id = null,
      ip_address,
      payment_error_message = null,
    } = req.body;

    // console.log(
    //   "=======create order body in new function ============================="
    // );
    // console.log(req.body);
    // console.log("====================================");

    // Validate items array
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res
        .status(400)
        .json({ error: "Items array is required and cannot be empty" });
    }

    // Fetch all products from database to validate prices
    const productIds = items.map((item) => item.product_id);
    const products = await Product.find({ _id: { $in: productIds } });

    if (products.length !== productIds.length) {
      return res.status(400).json({ error: "One or more products not found" });
    }

    // Create a map of product_id to product for quick lookup
    const productMap = new Map();
    products.forEach((product) => {
      productMap.set(product._id.toString(), product);
    });

    // Validate prices and calculate actual total
    let calculatedTotal = 0;
    const validatedItems = [];

    for (const item of items) {
      const product = productMap.get(item.product_id);
      if (!product) {
        return res
          .status(400)
          .json({ error: `Product with ID ${item.product_id} not found` });
      }

      // Determine the correct price based on selected_set flag
      let actualPrice;
      if (item.selected_set && product.set_price) {
        actualPrice = product.set_price;
      } else {
        actualPrice = product.price;
      }

      // Validate that the provided price matches the actual price
      if (item.price !== actualPrice) {
        return res.status(400).json({
          error: `Price mismatch for product ${product.name}. Expected: ${actualPrice}, Received: ${item.price}`,
        });
      }

      // Validate quantity
      if (!item.quantity || item.quantity <= 0) {
        return res
          .status(400)
          .json({ error: `Invalid quantity for product ${product.name}` });
      }

      // Calculate item total
      const itemTotal = actualPrice * item.quantity;
      calculatedTotal += itemTotal;

      validatedItems.push({
        ...item,
        price: actualPrice,
        itemTotal,
      });
    }

    // Validate total_amount matches calculated total
    if (Math.abs(total_amount - calculatedTotal) > 0.01) {
      // Allow for small floating point differences
      return res.status(400).json({
        error: `Total amount mismatch. Expected: ${calculatedTotal}, Received: ${total_amount}`,
      });
    }

    // 1. Create the order (without items) - use calculated total
    const newOrder = await Order.create({
      customer_name,
      email,
      phone,
      address,
      pincode,
      total_amount: calculatedTotal, // Use calculated total instead of provided total
      payment_method,
      payment_status,
      delivery_instructions,
      payment_reference_id:
        payment_method === "cod" ? null : payment_reference_id,
      razorpay_order_id,
      payment_error_message,
      user_id,
      status: "new",
      ip_address,
    });

    // 2. Create order items with validated prices
    const orderItems = await Promise.all(
      validatedItems.map((item) =>
        OrderItem.create({
          order: newOrder._id,
          product: item.product_id,
          quantity: item.quantity,
          price: item.price, // This is now the validated price from database
          selected_set: !!item.selected_set,
          created_at: new Date(),
        })
      )
    );

    // 3. Update the order's items array
    newOrder.items = orderItems.map((item) => item._id);
    await newOrder.save();

    // 4. Populate items and customer for frontend
    const populatedOrder = await Order.findById(newOrder._id)
      .populate({
        path: "customer",
        select: "customer_name email phone address pincode",
      })
      .populate({
        path: "items",
        populate: {
          path: "product",
          select: "name price image brand category description",
        },
      });

    res.status(201).json(populatedOrder);
  } catch (error) {
    console.log("============error in orders ========================");
    console.log(error);
    console.log("====================================");
    res.status(500).json({ error: error.message });
  }
};

// export const createOrder = async (req, res) => {
//   try {
//     const {
//       // optional: ObjectId of existing customer
//       customer_name,
//       email,
//       phone,
//       address,
//       pincode,
//       total_amount,
//       payment_method,
//       payment_status,
//       items,
//       delivery_instructions,
//       payment_reference_id,
//       user_id,
//       ip_address,
//     } = req.body;

//     // console.log("====================================");
//     // console.log(user_id);
//     // console.log("====================================");
//     // Find the mongo user by clerk_id from req.user

//     console.log("=======create order body =============================");
//     console.log(req.body);
//     console.log("====================================");

//     // 1. Create the order (without items)
//     const newOrder = await Order.create({
//       // customer: customer || undefined, // if provided
//       customer_name,
//       email,
//       phone,
//       address,
//       pincode,
//       total_amount,
//       payment_method,
//       payment_status,
//       delivery_instructions,
//       payment_reference_id:
//         payment_method === "cod" ? null : payment_reference_id,
//       user_id,
//       status: "new",
//       ip_address,
//     });

//     // 2. Create order items
//     const orderItems = await Promise.all(
//       items.map((item) =>
//         OrderItem.create({
//           order: newOrder._id,
//           product: item.product_id,
//           quantity: item.quantity,
//           price: item.price,
//           selected_set: !!item.selected_set,
//           created_at: new Date(),
//         })
//       )
//     );

//     // 3. Update the order's items array
//     newOrder.items = orderItems.map((item) => item._id);
//     await newOrder.save();

//     // 4. Optionally, populate items and customer for frontend
//     const populatedOrder = await Order.findById(newOrder._id)
//       .populate({
//         path: "customer",
//         select: "customer_name email phone address pincode",
//       })
//       .populate({
//         path: "items",
//         populate: {
//           path: "product",
//           select: "name price image brand category description",
//         },
//       });

//     res.status(201).json(populatedOrder);
//   } catch (error) {
//     console.log("============errorn in orders ========================");
//     console.log(error);
//     console.log("====================================");
//     res.status(500).json({ error: error.message });
//   }
// };

// Update order status (admin only)
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    )
      .populate({
        path: "customer",
        select: "customer_name email phone address pincode",
      })
      .populate({
        path: "items",
        populate: {
          path: "product",
          select: "name price image brand category description",
        },
      });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Transform the data to match frontend format
    const formattedOrder = formatOrderForFrontend(order);

    res.json(formattedOrder);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Fetch the current user's orders
export const getProfileOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user_id: req.user.id }).populate({
      path: "items",
      populate: {
        path: "product",
        select: "name price image brand category description",
      },
    });
    const formattedOrders = orders.map(formatOrderForFrontend);
    res.json(formattedOrders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
