import { useEffect, useState } from "react";
import api from "../../api/axios";
import Loader from "../../components/Loader";
import { toast } from "react-toastify";

const emptyForm = {
  name: "",
  brand: "",
  category: "running",
  description: "",
  price: "",
  discountPrice: "",
  images: "",
  sizes: [{ size: 7, stock: 0 }, { size: 8, stock: 0 }, { size: 9, stock: 0 }, { size: 10, stock: 0 }],
};

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  const fetchProducts = async () => {
    setLoading(true);
    const { data } = await api.get("/products?limit=100");
    setProducts(data.products);
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSizeChange = (idx, field, value) => {
    const updated = [...form.sizes];
    updated[idx][field] = Number(value);
    setForm({ ...form, sizes: updated });
  };

  const addSizeRow = () => setForm({ ...form, sizes: [...form.sizes, { size: 0, stock: 0 }] });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      price: Number(form.price),
      discountPrice: Number(form.discountPrice) || 0,
      images: form.images.split(",").map((s) => s.trim()).filter(Boolean),
    };
    try {
      if (editingId) {
        await api.put(`/products/${editingId}`, payload);
        toast.success("Product updated");
      } else {
        await api.post("/products", payload);
        toast.success("Product created");
      }
      setForm(emptyForm);
      setShowForm(false);
      setEditingId(null);
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not save product");
    }
  };

  const handleEdit = (p) => {
    setForm({
      ...p,
      images: p.images.join(", "),
      discountPrice: p.discountPrice || "",
    });
    setEditingId(p._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this product?")) return;
    await api.delete(`/products/${id}`);
    fetchProducts();
  };

  if (loading) return <Loader />;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Products ({products.length})</h2>
        <button
          onClick={() => {
            setForm(emptyForm);
            setEditingId(null);
            setShowForm(!showForm);
          }}
          className="btn-primary"
        >
          {showForm ? "Cancel" : "+ Add Product"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="card p-6 mb-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input placeholder="Name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" />
            <input placeholder="Brand" required value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} className="input-field" />
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="input-field">
              {["running", "casual", "formal", "sports", "sandals", "boots"].map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <input type="number" placeholder="Price" required value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="input-field" />
            <input type="number" placeholder="Discount Price (optional)" value={form.discountPrice} onChange={(e) => setForm({ ...form, discountPrice: e.target.value })} className="input-field" />
            <input placeholder="Image URLs (comma-separated)" value={form.images} onChange={(e) => setForm({ ...form, images: e.target.value })} className="input-field col-span-2" />
          </div>
          <textarea placeholder="Description" required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input-field" rows={3} />

          <div>
            <p className="font-medium mb-2 text-sm">Sizes & Stock</p>
            <div className="grid grid-cols-4 gap-2">
              {form.sizes.map((s, idx) => (
                <div key={idx} className="flex gap-1 items-center">
                  <input type="number" placeholder="Size" value={s.size} onChange={(e) => handleSizeChange(idx, "size", e.target.value)} className="input-field w-16 text-sm" />
                  <input type="number" placeholder="Stock" value={s.stock} onChange={(e) => handleSizeChange(idx, "stock", e.target.value)} className="input-field w-16 text-sm" />
                </div>
              ))}
            </div>
            <button type="button" onClick={addSizeRow} className="text-sm text-brand-accent mt-2">
              + Add size
            </button>
          </div>

          <button type="submit" className="btn-accent">
            {editingId ? "Update Product" : "Create Product"}
          </button>
        </form>
      )}

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="p-3">Product</th>
              <th className="p-3">Category</th>
              <th className="p-3">Price</th>
              <th className="p-3">Stock</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id} className="border-t">
                <td className="p-3 flex items-center gap-2">
                  <img src={p.images[0]} className="w-10 h-10 rounded object-cover" />
                  {p.name}
                </td>
                <td className="p-3 capitalize">{p.category}</td>
                <td className="p-3">₹{p.discountPrice || p.price}</td>
                <td className="p-3">{p.sizes.reduce((s, x) => s + x.stock, 0)}</td>
                <td className="p-3 space-x-2">
                  <button onClick={() => handleEdit(p)} className="text-brand-accent hover:underline">Edit</button>
                  <button onClick={() => handleDelete(p._id)} className="text-red-500 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminProducts;
