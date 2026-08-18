import asyncHandler from "express-async-handler";
import Stripe from "stripe";
import Order from "../models/Order.js";
import { markOrderPaid } from "./orderController.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_placeholder");

// @desc Create a Stripe PaymentIntent for a given order
// @route POST /api/payments/create-payment-intent
// @access Private
export const createPaymentIntent = asyncHandler(async (req, res) => {
  const { orderId } = req.body;

  const order = await Order.findById(orderId);
  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }
  if (order.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized for this order");
  }
  if (order.isPaid) {
    res.status(400);
    throw new Error("Order is already paid");
  }

  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(order.totalPrice * 100), // Stripe uses smallest currency unit (paise/cents)
    currency: "inr",
    automatic_payment_methods: { enabled: true },
    metadata: { orderId: order._id.toString(), userId: req.user._id.toString() },
  });

  res.json({ success: true, clientSecret: paymentIntent.client_secret });
});

// @desc Stripe webhook - the SOURCE OF TRUTH for payment success, never trust the frontend alone
// @route POST /api/payments/webhook
// @access Public (verified via Stripe signature)
export const stripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "payment_intent.succeeded") {
    const intent = event.data.object;
    const orderId = intent.metadata.orderId;
    await markOrderPaid(orderId, {
      id: intent.id,
      status: intent.status,
      update_time: new Date().toISOString(),
      email_address: intent.receipt_email || "",
    });
    console.log(`Order ${orderId} marked as paid via webhook`);
  }

  if (event.type === "payment_intent.payment_failed") {
    console.log(`Payment failed for intent ${event.data.object.id}`);
    // Optionally: mark order as a failed-payment state / notify user
  }

  res.json({ received: true });
};
