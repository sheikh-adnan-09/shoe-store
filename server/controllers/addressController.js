import asyncHandler from "express-async-handler";
import User from "../models/User.js";

// @desc Get all addresses for logged-in user
// @route GET /api/addresses
export const getAddresses = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  res.json({ success: true, addresses: user.addresses });
});

// @desc Add new address
// @route POST /api/addresses
export const addAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const { fullName, phone, line1, line2, city, state, postalCode, country, isDefault } = req.body;

  if (!fullName || !phone || !line1 || !city || !state || !postalCode || !country) {
    res.status(400);
    throw new Error("Please fill all required address fields");
  }

  if (isDefault || user.addresses.length === 0) {
    user.addresses.forEach((a) => (a.isDefault = false));
  }

  user.addresses.push({
    fullName,
    phone,
    line1,
    line2,
    city,
    state,
    postalCode,
    country,
    isDefault: isDefault || user.addresses.length === 0,
  });

  await user.save();
  res.status(201).json({ success: true, addresses: user.addresses });
});

// @desc Update address
// @route PUT /api/addresses/:addressId
export const updateAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const address = user.addresses.id(req.params.addressId);

  if (!address) {
    res.status(404);
    throw new Error("Address not found");
  }

  Object.assign(address, req.body);

  if (req.body.isDefault) {
    user.addresses.forEach((a) => {
      if (a._id.toString() !== address._id.toString()) a.isDefault = false;
    });
  }

  await user.save();
  res.json({ success: true, addresses: user.addresses });
});

// @desc Delete address
// @route DELETE /api/addresses/:addressId
export const deleteAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  user.addresses = user.addresses.filter(
    (a) => a._id.toString() !== req.params.addressId
  );
  await user.save();
  res.json({ success: true, addresses: user.addresses });
});

// @desc Set default address
// @route PUT /api/addresses/:addressId/default
export const setDefaultAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  user.addresses.forEach((a) => {
    a.isDefault = a._id.toString() === req.params.addressId;
  });
  await user.save();
  res.json({ success: true, addresses: user.addresses });
});
