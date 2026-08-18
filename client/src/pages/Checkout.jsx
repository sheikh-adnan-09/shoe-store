import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import api from "../api/axios";
import { useCart } from "../context/CartContext";
import StripePaymentForm from "../components/StripePaymentForm";
import Loader from "../components/Loader";
import { toast } from "react-toastify";

// Replace with your real Stripe publishable key
const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || "pk_test_placeholder",
);

const STEPS = { ADDRESS: 1, PAYMENT_METHOD: 2, PAY: 3 };

const Checkout = () => {
  const { cart, subtotal, fetchCart } = useCart();
  const navigate = useNavigate();

  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [step, setStep] = useState(STEPS.ADDRESS);
  const [order, setOrder] = useState(null);
  const [clientSecret, setClientSecret] = useState(null);
  const [placing, setPlacing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/addresses").then(({ data }) => {
      setAddresses(data.addresses);
      const def = data.addresses.find((a) => a.isDefault) || data.addresses[0];
      if (def) setSelectedAddress(def._id);
      setLoading(false);
    });
  }, []);

  const shippingPrice = subtotal > 999 ? 0 : 50;
  const taxPrice = Number((subtotal * 0.05).toFixed(2));
  const total = Number((subtotal + shippingPrice + taxPrice).toFixed(2));

  const handlePlaceOrder = async () => {
    if (!selectedAddress) return toast.warn("Please select a delivery address");
    setPlacing(true);
    try {
      const { data } = await api.post("/orders", {
        addressId: selectedAddress,
        paymentMethod,
      });
      setOrder(data.order);

      if (paymentMethod === "cod") {
        await fetchCart();
        navigate(`/order-success/${data.order._id}`);
        return;
      }

      // Card payment: create Stripe PaymentIntent for this order
      const { data: intentData } = await api.post(
        "/payments/create-payment-intent",
        {
          orderId: data.order._id,
        },
      );
      setClientSecret(intentData.clientSecret);
      setStep(STEPS.PAY);
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not place order");
    } finally {
      setPlacing(false);
    }
  };

  const handlePaymentSuccess = async () => {
    await fetchCart();
    navigate(`/order-success/${order._id}`);
  };

  if (loading) return <Loader />;

  if (!cart.items || cart.items.length === 0) {
    navigate("/cart");
    return null;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between gap-3 flex-wrap">
        <div>
          <p className="text-xs uppercase tracking-[0.32em] text-brand-accent font-semibold">
            Secure checkout
          </p>
          <h1 className="text-2xl font-bold mt-1">Checkout</h1>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1.5 text-xs text-amber-700 border border-amber-200">
          <span className="inline-block h-2 w-2 rounded-full bg-amber-500" />
          {paymentMethod === "cod"
            ? "Cash verified at delivery"
            : "Card payment secured with Stripe"}
        </div>
      </div>

      <div className="grid lg:grid-cols-[1.4fr_0.9fr] gap-8">
        <div className="space-y-6">
          {/* Step 1: Address */}
          <div className="card p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-semibold text-lg">1. Delivery Address</h2>
              <span className="text-xs rounded-full bg-gray-100 px-2.5 py-1 text-gray-600">
                Saved addresses
              </span>
            </div>
            {addresses.length === 0 ? (
              <p className="text-sm text-gray-500">
                No saved addresses.{" "}
                <a
                  href="/addresses"
                  className="text-brand-accent underline font-medium"
                >
                  Add one here
                </a>{" "}
                first.
              </p>
            ) : (
              <div className="space-y-2">
                {addresses.map((a) => (
                  <label
                    key={a._id}
                    className={`flex gap-3 p-3 border rounded-xl cursor-pointer transition ${
                      selectedAddress === a._id
                        ? "border-brand-accent bg-orange-50 shadow-sm"
                        : "border-gray-200 hover:border-brand-accent/50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="address"
                      checked={selectedAddress === a._id}
                      onChange={() => setSelectedAddress(a._id)}
                    />
                    <div className="text-sm">
                      <p className="font-medium text-gray-900">
                        {a.fullName} — {a.phone}
                      </p>
                      <p className="text-gray-600 mt-0.5">
                        {a.line1}, {a.city}, {a.state} {a.postalCode},{" "}
                        {a.country}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Step 2: Payment method */}
          {step === STEPS.ADDRESS && (
            <div className="card p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-semibold text-lg">2. Payment Method</h2>
                <span className="text-xs rounded-full bg-slate-100 px-2.5 py-1 text-slate-600">
                  Choose a method
                </span>
              </div>
              <div className="grid md:grid-cols-2 gap-3">
                <label
                  className={`p-4 border rounded-xl cursor-pointer transition ${paymentMethod === "cod" ? "border-amber-400 bg-amber-50" : "border-gray-200 hover:border-amber-300"}`}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="radio"
                      name="pm"
                      checked={paymentMethod === "cod"}
                      onChange={() => setPaymentMethod("cod")}
                    />
                    <div>
                      <p className="font-semibold">Cash on Delivery</p>
                      <p className="text-sm text-gray-600 mt-1">
                        Pay when your order reaches your doorstep.
                      </p>
                    </div>
                  </div>
                </label>
                <label
                  className={`p-4 border rounded-xl cursor-pointer transition ${paymentMethod === "card" ? "border-brand-accent bg-orange-50" : "border-gray-200 hover:border-brand-accent/50"}`}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="radio"
                      name="pm"
                      checked={paymentMethod === "card"}
                      onChange={() => setPaymentMethod("card")}
                    />
                    <div>
                      <p className="font-semibold">Card Payment</p>
                      <p className="text-sm text-gray-600 mt-1">
                        Secure online checkout using Stripe.
                      </p>
                    </div>
                  </div>
                </label>
              </div>
              <div className="mt-4 rounded-lg bg-slate-50 border border-slate-200 px-4 py-3 text-sm text-slate-600">
                {paymentMethod === "cod"
                  ? "A COD order is confirmed now, and the payment is verified by the delivery agent at the time of handover."
                  : "Card orders will finish with a secure payment step before the order is finalized."}
              </div>
              <button
                onClick={handlePlaceOrder}
                disabled={placing || !selectedAddress}
                className="btn-primary w-full mt-4"
              >
                {placing ? "Placing order..." : "Place Order"}
              </button>
            </div>
          )}

          {/* Step 3: Card payment */}
          {step === STEPS.PAY && clientSecret && (
            <div className="card p-6">
              <h2 className="font-semibold mb-4">3. Enter Card Details</h2>
              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <StripePaymentForm onSuccess={handlePaymentSuccess} />
              </Elements>
              <p className="text-xs text-gray-400 mt-2">
                Test card: 4242 4242 4242 4242, any future date, any CVC.
              </p>
            </div>
          )}
        </div>

        <div className="card p-6 h-fit">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-lg">Order Summary</h2>
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600">
              {cart.items.length} items
            </span>
          </div>
          <div className="space-y-3">
            {cart.items.map((i) => (
              <div key={i._id} className="flex justify-between gap-3 text-sm">
                <span className="text-gray-700">
                  {i.name}{" "}
                  <span className="text-gray-400">(Size {i.size})</span> ×{" "}
                  {i.quantity}
                </span>
                <span className="font-medium">
                  ₹{(i.price * i.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
          <hr className="my-4" />
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Shipping</span>
              <span>{shippingPrice === 0 ? "Free" : `₹${shippingPrice}`}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tax (5%)</span>
              <span>₹{taxPrice.toFixed(2)}</span>
            </div>
          </div>
          <hr className="my-4" />
          <div className="flex justify-between font-semibold text-base">
            <span>Total</span>
            <span>₹{total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
