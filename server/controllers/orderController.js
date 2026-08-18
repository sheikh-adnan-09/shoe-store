import asyncHandler from "express-async-handler";
import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import User from "../models/User.js";

const SHIPPING_FLAT_RATE = 50;
const TAX_RATE = 0.05;

// @desc Create new order from cart (COD or after card payment is confirmed client-side;
//       for card payments this creates a "pending" order that the webhook marks paid)
// @route POST /api/orders
// @access Private
export const createOrder = asyncHandler(async (req, res) => {
  const { addressId, paymentMethod } = req.body;

  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart || cart.items.length === 0) {
    res.status(400);
    throw new Error("Your cart is empty");
  }

  const user = await User.findById(req.user._id);
  const address = user.addresses.id(addressId);
  if (!address) {
    res.status(400);
    throw new Error("Please select a valid delivery address");
  }

  // Re-validate stock at order time (prices/stock could have changed since add-to-cart)
  for (const item of cart.items) {
    const product = await Product.findById(item.product);
    const sizeEntry = product?.sizes.find((s) => s.size === item.size);
    if (!product || !sizeEntry || sizeEntry.stock < item.quantity) {
      res.status(400);
      throw new Error(
        `"${item.name}" (size ${item.size}) no longer has enough stock`,
      );
    }
  }

  const itemsPrice = cart.items.reduce(
    (sum, i) => sum + i.price * i.quantity,
    0,
  );
  const shippingPrice = itemsPrice > 999 ? 0 : SHIPPING_FLAT_RATE;
  const taxPrice = Number((itemsPrice * TAX_RATE).toFixed(2));
  const totalPrice = Number((itemsPrice + shippingPrice + taxPrice).toFixed(2));

  const order = await Order.create({
    user: req.user._id,
    items: cart.items.map((i) => ({
      product: i.product,
      name: i.name,
      image: i.image,
      size: i.size,
      price: i.price,
      quantity: i.quantity,
    })),
    shippingAddress: {
      fullName: address.fullName,
      phone: address.phone,
      line1: address.line1,
      line2: address.line2,
      city: address.city,
      state: address.state,
      postalCode: address.postalCode,
      country: address.country,
    },
    paymentMethod,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
    paymentStatus: "pending",
    // COD orders are accepted and prepared for dispatch; payment is verified during delivery.
    // Card orders wait for the payment webhook to confirm success.
    status: paymentMethod === "cod" ? "processing" : "pending",
    isPaid: false,
  });

  // Decrement stock now that the order is placed (COD) — for card payments,
  // in a stricter real-world setup you'd only decrement after the webhook confirms
  // payment. We decrement here for simplicity/demo purposes in both cases,
  // and would roll back stock on payment failure via a scheduled job.
  for (const item of cart.items) {
    await Product.updateOne(
      { _id: item.product, "sizes.size": item.size },
      { $inc: { "sizes.$.stock": -item.quantity } },
    );
  }

  cart.items = [];
  await cart.save();

  res.status(201).json({ success: true, order });
});

// @desc Get order by ID
// @route GET /api/orders/:id
// @access Private
export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email",
  );

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  if (
    order.user._id.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    res.status(403);
    throw new Error("Not authorized to view this order");
  }

  res.json({ success: true, order });
});

// @desc Get logged-in user's orders
// @route GET /api/orders/myorders
// @access Private
export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort("-createdAt");
  res.json({ success: true, orders });
});

// @desc Get all orders (admin)
// @route GET /api/orders
// @access Private/Admin
export const getAllOrders = asyncHandler(async (req, res) => {
  const pageSize = Number(req.query.limit) || 20;
  const page = Number(req.query.page) || 1;
  const filter = {};
  if (req.query.status) filter.status = req.query.status;

  const count = await Order.countDocuments(filter);
  const orders = await Order.find(filter)
    .populate("user", "name email")
    .sort("-createdAt")
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({
    success: true,
    orders,
    page,
    pages: Math.ceil(count / pageSize),
    total: count,
  });
});

// @desc Update order status (admin)
// @route PUT /api/orders/:id/status
// @access Private/Admin
export const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  const { status } = req.body;
  order.status = status;

  if (status === "delivered") {
    order.isDelivered = true;
    order.deliveredAt = Date.now();
  }
  if (status === "cancelled" && order.status !== "delivered") {
    // restock items on cancellation
    for (const item of order.items) {
      await Product.updateOne(
        { _id: item.product, "sizes.size": item.size },
        { $inc: { "sizes.$.stock": item.quantity } },
      );
    }
  }

  const updated = await order.save();
  res.json({ success: true, order: updated });
});

// @desc Mark order as paid (used internally by webhook, or manually by admin for COD reconciliation)
export const markOrderPaid = async (orderId, paymentResult) => {
  const order = await Order.findById(orderId);
  if (!order) return null;
  order.isPaid = true;
  order.paymentStatus = "paid";
  order.paidAt = Date.now();
  order.paymentVerifiedAt = order.paymentVerifiedAt || Date.now();
  order.paymentResult = paymentResult;
  if (order.status === "pending") order.status = "processing";
  await order.save();
  return order;
};

// @desc Admin verifies cash payment collected for a COD order
// @route PUT /api/orders/:id/verify-cod-payment
// @access Private/Admin
export const verifyCashOnDeliveryPayment = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  if (order.paymentMethod !== "cod") {
    res.status(400);
    throw new Error("This order is not a cash-on-delivery order");
  }

  if (order.isPaid) {
    res.status(400);
    throw new Error("Cash payment has already been verified for this order");
  }

  order.isPaid = true;
  order.paymentStatus = "paid";
  order.paidAt = Date.now();
  order.paymentVerifiedAt = Date.now();
  order.paymentResult = {
    status: "cash_on_delivery_verified",
    update_time: new Date().toISOString(),
  };

  await order.save();
  res.json({ success: true, order });
});
