import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/axios";
import Loader from "../components/Loader";

const OrderSuccess = () => {
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

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center">
      <div className="text-5xl mb-4">✅</div>
      <h1 className="text-2xl font-bold mb-2">Order Placed Successfully!</h1>
      <p className="text-gray-500 mb-6">
        Order #{order?._id.slice(-8).toUpperCase()} has been{" "}
        {order?.paymentMethod === "cod" ? "confirmed" : "received"}.
        {order?.paymentMethod === "cod"
          ? " Cash will be verified at the time of delivery before the dispatch is finalized."
          : order?.paymentMethod === "card" && !order?.isPaid
            ? " Your payment is being confirmed."
            : ""}
      </p>
      <div className="flex justify-center gap-3">
        <Link to={`/orders/${order?._id}`} className="btn-primary">
          View Order
        </Link>
        <Link to="/" className="btn-outline">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccess;
