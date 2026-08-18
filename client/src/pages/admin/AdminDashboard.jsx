import { useEffect, useState } from "react";
import api from "../../api/axios";
import Loader from "../../components/Loader";

const StatCard = ({ label, value }) => (
  <div className="card p-4">
    <p className="text-sm text-gray-500">{label}</p>
    <p className="text-2xl font-bold mt-1">{value}</p>
  </div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/admin/dashboard").then(({ data }) => {
      setStats(data.stats);
      setLoading(false);
    });
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Revenue" value={`₹${stats.totalRevenue.toFixed(2)}`} />
        <StatCard label="Total Orders" value={stats.totalOrders} />
        <StatCard label="Total Users" value={stats.totalUsers} />
        <StatCard label="Total Products" value={stats.totalProducts} />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="card p-4">
          <h2 className="font-semibold mb-3">Recent Orders</h2>
          {stats.recentOrders.map((o) => (
            <div key={o._id} className="flex justify-between text-sm py-2 border-b last:border-0">
              <span>{o.user?.name || "Unknown"}</span>
              <span className="capitalize">{o.status}</span>
              <span className="font-medium">₹{o.totalPrice.toFixed(2)}</span>
            </div>
          ))}
        </div>

        <div className="card p-4">
          <h2 className="font-semibold mb-3">Low Stock Alerts</h2>
          {stats.lowStockProducts.length === 0 ? (
            <p className="text-sm text-gray-500">All products well-stocked.</p>
          ) : (
            stats.lowStockProducts.map((p) => (
              <div key={p._id} className="flex justify-between text-sm py-2 border-b last:border-0">
                <span>{p.name}</span>
                <span className="text-red-500">
                  {p.sizes.filter((s) => s.stock < 5).map((s) => `${s.size}(${s.stock})`).join(", ")}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
