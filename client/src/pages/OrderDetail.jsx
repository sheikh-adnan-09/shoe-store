import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/axios";
import Loader from "../components/Loader";

const statusColors = {
  pending: "bg-yellow-100 text-yellow-700",
  processing: "bg-blue-100 text-blue-700",
  shipped: "bg-purple-100 text-purple-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

const OrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/orders/${id}`).then(({ data }) => {
      setOrder(data.order);
      setLoading(false);
    });
  }, [id]);

  if (loading) return <Loader />;
  if (!order) return <p className="text-center py-20">Order not found</p>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold">
            Order #{order._id.slice(-8).toUpperCase()}
          </h1>
          <p className="text-sm text-gray-500">
            Placed on {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>
        <span
          className={`text-xs px-3 py-1 rounded-full capitalize ${statusColors[order.status]}`}
        >
          {order.status}
        </span>
      </div>

      <div className="card p-6 mb-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-semibold">Items</h2>
          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] text-slate-600 uppercase tracking-wide">
            {order.items.length} product(s)
          </span>
        </div>
        {order.items.map((item, i) => (
          <div key={i} className="flex gap-4 py-3 border-b last:border-0">
            <img
              src={item.image}
              alt={item.name}
              className="w-16 h-16 object-cover rounded"
            />
            <div className="flex-1">
              <p className="font-medium text-sm">{item.name}</p>
              <p className="text-xs text-gray-500 mt-1">
                Size {item.size} • Qty {item.quantity}
              </p>
            </div>
            <p className="font-medium text-sm">
              ₹{(item.price * item.quantity).toFixed(2)}
            </p>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="card p-6">
          <h2 className="font-semibold mb-3">Shipping Address</h2>
          <p className="text-sm">{order.shippingAddress.fullName}</p>
          <p className="text-sm text-gray-600">{order.shippingAddress.phone}</p>
          <p className="text-sm text-gray-600">
            {order.shippingAddress.line1}, {order.shippingAddress.city},{" "}
            {order.shippingAddress.state} {order.shippingAddress.postalCode},{" "}
            {order.shippingAddress.country}
          </p>
        </div>

        <div className="card p-6">
          <h2 className="font-semibold mb-3">Payment Summary</h2>
          <div className="flex justify-between text-sm mb-1">
            <span>Items</span>
            <span>₹{order.itemsPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm mb-1">
            <span>Shipping</span>
            <span>
              {order.shippingPrice === 0 ? "Free" : `₹${order.shippingPrice}`}
            </span>
          </div>
          <div className="flex justify-between text-sm mb-2">
            <span>Tax</span>
            <span>₹{order.taxPrice.toFixed(2)}</span>
          </div>
          <hr className="my-2" />
          <div className="flex justify-between font-semibold mb-2">
            <span>Total</span>
            <span>₹{order.totalPrice.toFixed(2)}</span>
          </div>
          <div className="rounded-lg bg-slate-50 p-3 text-xs text-slate-600 border border-slate-200">
            <p className="font-medium text-slate-800 mb-1">Payment status</p>
            <p>
              Method:{" "}
              {order.paymentMethod === "cod" ? "Cash on Delivery" : "Card"}
            </p>
            <p className="mt-1">
              {order.paymentMethod === "cod"
                ? order.isPaid
                  ? `Cash payment verified on ${new Date(order.paymentVerifiedAt || order.paidAt).toLocaleDateString()}`
                  : "Cash payment is pending verification at delivery"
                : order.isPaid
                  ? `Paid on ${new Date(order.paidAt).toLocaleDateString()}`
                  : "Card payment is still pending confirmation"}
            </p>
          </div>
        </div>
      </div>
      <div className="flex justify-center mt-6">
        <Link to="/" className="btn-outline">
          Home
        </Link>
      </div>
    </div>
  );
};

export default OrderDetail;
