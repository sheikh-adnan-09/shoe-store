import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import Loader from "../components/Loader";

const statusColors = {
  pending: "bg-yellow-100 text-yellow-700",
  processing: "bg-blue-100 text-blue-700",
  shipped: "bg-purple-100 text-purple-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/orders/myorders").then(({ data }) => {
      setOrders(data.orders);
      setLoading(false);
    });
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>
      {orders.length === 0 ? (
        <p className="text-gray-500">You haven't placed any orders yet.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((o) => (
            <Link
              to={`/orders/${o._id}`}
              key={o._id}
              className="card p-4 flex justify-between items-center hover:shadow-md transition"
            >
              <div>
                <p className="font-medium">
                  Order #{o._id.slice(-8).toUpperCase()}
                </p>
                <p className="text-sm text-gray-500">
                  {new Date(o.createdAt).toLocaleDateString()} •{" "}
                  {o.items.length} item(s)
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold">₹{o.totalPrice.toFixed(2)}</p>
                <span
                  className={`text-xs px-2 py-1 rounded-full capitalize ${statusColors[o.status]}`}
                >
                  {o.status}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
