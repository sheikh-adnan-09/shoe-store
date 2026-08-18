import asyncHandler from "express-async-handler";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

const getOrCreateCart = async (userId) => {
  let cart = await Cart.findOne({ user: userId });
  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
  }
  return cart;
};

// @desc Get logged-in user's cart
// @route GET /api/cart
export const getCart = asyncHandler(async (req, res) => {
  const cart = await getOrCreateCart(req.user._id);
  res.json({ success: true, cart });
});

// @desc Add item to cart
// @route POST /api/cart
export const addToCart = asyncHandler(async (req, res) => {
  const { productId, size, quantity } = req.body;

  const product = await Product.findById(productId);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  const sizeEntry = product.sizes.find((s) => s.size === Number(size));
  if (!sizeEntry || sizeEntry.stock < 1) {
    res.status(400);
    throw new Error("Selected size is out of stock");
  }

  const cart = await getOrCreateCart(req.user._id);
  const existingItem = cart.items.find(
    (i) => i.product.toString() === productId && i.size === Number(size)
  );

  const qtyToAdd = Number(quantity) || 1;

  if (existingItem) {
    if (existingItem.quantity + qtyToAdd > sizeEntry.stock) {
      res.status(400);
      throw new Error(`Only ${sizeEntry.stock} items in stock for this size`);
    }
    existingItem.quantity += qtyToAdd;
  } else {
    if (qtyToAdd > sizeEntry.stock) {
      res.status(400);
      throw new Error(`Only ${sizeEntry.stock} items in stock for this size`);
    }
    cart.items.push({
      product: product._id,
      name: product.name,
      image: product.images[0],
      size: Number(size),
      price: product.discountPrice > 0 ? product.discountPrice : product.price,
      quantity: qtyToAdd,
    });
  }

  await cart.save();
  res.status(201).json({ success: true, cart });
});

// @desc Update cart item quantity
// @route PUT /api/cart/:itemId
export const updateCartItem = asyncHandler(async (req, res) => {
  const { quantity } = req.body;
  const cart = await getOrCreateCart(req.user._id);
  const item = cart.items.id(req.params.itemId);

  if (!item) {
    res.status(404);
    throw new Error("Cart item not found");
  }

  const product = await Product.findById(item.product);
  const sizeEntry = product?.sizes.find((s) => s.size === item.size);
  if (sizeEntry && quantity > sizeEntry.stock) {
    res.status(400);
    throw new Error(`Only ${sizeEntry.stock} items in stock for this size`);
  }

  item.quantity = quantity;
  await cart.save();
  res.json({ success: true, cart });
});

// @desc Remove item from cart
// @route DELETE /api/cart/:itemId
export const removeCartItem = asyncHandler(async (req, res) => {
  const cart = await getOrCreateCart(req.user._id);
  cart.items = cart.items.filter((i) => i._id.toString() !== req.params.itemId);
  await cart.save();
  res.json({ success: true, cart });
});

// @desc Clear entire cart
// @route DELETE /api/cart
export const clearCart = asyncHandler(async (req, res) => {
  const cart = await getOrCreateCart(req.user._id);
  cart.items = [];
  await cart.save();
  res.json({ success: true, cart });
});
