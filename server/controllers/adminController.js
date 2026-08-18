import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";

// @desc Dashboard stats
// @route GET /api/admin/dashboard
export const getDashboardStats = asyncHandler(async (req, res) => {
  const totalUsers = await User.countDocuments({ role: "user" });
  const totalProducts = await Product.countDocuments();
  const totalOrders = await Order.countDocuments();

  const revenueAgg = await Order.aggregate([
    { $match: { isPaid: true } },
    { $group: { _id: null, total: { $sum: "$totalPrice" } } },
  ]);
  const totalRevenue = revenueAgg[0]?.total || 0;

  const ordersByStatus = await Order.aggregate([
    { $group: { _id: "$status", count: { $sum: 1 } } },
  ]);

  const recentOrders = await Order.find()
    .populate("user", "name email")
    .sort("-createdAt")
    .limit(5);

  const lowStockProducts = await Product.find({
    "sizes.stock": { $lt: 5 },
  }).limit(5);

  res.json({
    success: true,
    stats: {
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue,
      ordersByStatus,
      recentOrders,
      lowStockProducts,
    },
  });
});

// @desc Get all users (admin)
// @route GET /api/admin/users
export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select("-password").sort("-createdAt");
  res.json({ success: true, users });
});

// @desc Toggle block/unblock user
// @route PUT /api/admin/users/:id/block
export const toggleBlockUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  if (user.role === "admin") {
    res.status(400);
    throw new Error("Cannot block an admin");
  }
  user.isBlocked = !user.isBlocked;
  await user.save();
  res.json({ success: true, user: { _id: user._id, isBlocked: user.isBlocked } });
});

// @desc Promote/demote user role
// @route PUT /api/admin/users/:id/role
export const updateUserRole = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  user.role = req.body.role === "admin" ? "admin" : "user";
  await user.save();
  res.json({ success: true, user: { _id: user._id, role: user.role } });
});
