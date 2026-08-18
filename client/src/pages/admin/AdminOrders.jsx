import { useEffect, useState } from "react";
import api from "../../api/axios";
import Loader from "../../components/Loader";
import { toast } from "react-toastify";

const statusColors = {
  pending: "bg-yellow-100 text-yellow-700",
  processing: "bg-blue-100 text-blue-700",
  shipped: "bg-purple-100 text-purple-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

const STATUS_OPTIONS = [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("");

  const fetchOrders = async () => {
    setLoading(true);
    const params = filterStatus ? `?status=${filterStatus}` : "";
    const { data } = await api.get(`/orders${params}`);
    setOrders(data.orders);
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, [filterStatus]);

  const handleStatusChange = async (orderId, status) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status });
      toast.success("Order status updated");
      fetchOrders();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not update status");
    }
  };

  const handleVerifyCodPayment = async (orderId) => {
    try {
      await api.put(`/orders/${orderId}/verify-cod-payment`);
      toast.success("COD payment verified successfully");
      fetchOrders();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not verify payment");
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Orders ({orders.length})</h2>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="input-field w-48"
        >
          <option value="">All statuses</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s} className="capitalize">
              {s}
            </option>
          ))}
        </select>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="p-3">Order ID</th>
              <th className="p-3">Customer</th>
              <th className="p-3">Date</th>
              <th className="p-3">Total</th>
              <th className="p-3">Payment</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o._id} className="border-t">
                <td className="p-3 font-mono text-xs">
                  {o._id.slice(-8).toUpperCase()}
                </td>
                <td className="p-3">
                  {o.user?.name}
                  <br />
                  <span className="text-xs text-gray-400">{o.user?.email}</span>
                </td>
                <td className="p-3">
                  {new Date(o.createdAt).toLocaleDateString()}
                </td>
                <td className="p-3 font-medium">₹{o.totalPrice.toFixed(2)}</td>
                <td className="p-3">
                  {o.paymentMethod === "cod" ? (
                    <div className="space-y-1">
                      {o.isPaid ? (
                        <span className="text-green-600 text-xs">
                          COD verified
                        </span>
                      ) : (
                        <span className="text-amber-600 text-xs mr-2">
                          Awaiting cash check
                        </span>
                      )}
                      {!o.isPaid && (
                        <button
                          onClick={() => handleVerifyCodPayment(o._id)}
                          className="btn-outline text-[11px] px-2 py-1 rounded hover:bg-gray-300"
                        >
                          Verify COD
                        </button>
                      )}
                    </div>
                  ) : (
                    <span
                      className={
                        o.isPaid
                          ? "text-green-600 text-xs"
                          : "text-gray-400 text-xs"
                      }
                    >
                      {o.isPaid ? "Card paid" : "Card pending"}
                    </span>
                  )}
                </td>
                <td className="p-3">
                  <select
                    value={o.status}
                    onChange={(e) => handleStatusChange(o._id, e.target.value)}
                    className={`text-xs px-2 py-1 rounded-full border-0 capitalize font-medium ${statusColors[o.status]}`}
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && (
          <p className="text-center text-gray-500 py-8">No orders found.</p>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;
