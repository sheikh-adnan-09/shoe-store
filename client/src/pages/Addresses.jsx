import { useEffect, useState } from "react";
import api from "../api/axios";
import Loader from "../components/Loader";
import { toast } from "react-toastify";

const emptyForm = {
  fullName: "",
  phone: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  postalCode: "",
  country: "India",
};

const Addresses = () => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  const fetchAddresses = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/addresses");
      setAddresses(data.addresses);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/addresses/${editingId}`, form);
        toast.success("Address updated");
      } else {
        await api.post("/addresses", form);
        toast.success("Address added");
      }
      setForm(emptyForm);
      setShowForm(false);
      setEditingId(null);
      fetchAddresses();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not save address");
    }
  };

  const handleEdit = (address) => {
    setForm(address);
    setEditingId(address._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this address?")) return;
    await api.delete(`/addresses/${id}`);
    fetchAddresses();
  };

  const handleSetDefault = async (id) => {
    await api.put(`/addresses/${id}/default`);
    fetchAddresses();
  };

  if (loading) return <Loader />;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Addresses</h1>
        <button
          onClick={() => {
            setForm(emptyForm);
            setEditingId(null);
            setShowForm(!showForm);
          }}
          className="btn-primary"
        >
          {showForm ? "Cancel" : "+ Add Address"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="card p-6 mb-6 grid grid-cols-2 gap-4">
          <input name="fullName" placeholder="Full Name" required value={form.fullName} onChange={handleChange} className="input-field col-span-2" />
          <input name="phone" placeholder="Phone" required value={form.phone} onChange={handleChange} className="input-field col-span-2" />
          <input name="line1" placeholder="Address Line 1" required value={form.line1} onChange={handleChange} className="input-field col-span-2" />
          <input name="line2" placeholder="Address Line 2 (optional)" value={form.line2} onChange={handleChange} className="input-field col-span-2" />
          <input name="city" placeholder="City" required value={form.city} onChange={handleChange} className="input-field" />
          <input name="state" placeholder="State" required value={form.state} onChange={handleChange} className="input-field" />
          <input name="postalCode" placeholder="Postal Code" required value={form.postalCode} onChange={handleChange} className="input-field" />
          <input name="country" placeholder="Country" required value={form.country} onChange={handleChange} className="input-field" />
          <button type="submit" className="btn-accent col-span-2">
            {editingId ? "Update Address" : "Save Address"}
          </button>
        </form>
      )}

      <div className="space-y-4">
        {addresses.length === 0 && <p className="text-gray-500">No addresses saved yet.</p>}
        {addresses.map((a) => (
          <div key={a._id} className="card p-4 flex justify-between items-start">
            <div>
              <p className="font-medium">
                {a.fullName} {a.isDefault && <span className="text-xs text-brand-accent">(Default)</span>}
              </p>
              <p className="text-sm text-gray-600">{a.phone}</p>
              <p className="text-sm text-gray-600">
                {a.line1}, {a.line2 && `${a.line2}, `}
                {a.city}, {a.state} {a.postalCode}, {a.country}
              </p>
            </div>
            <div className="flex flex-col gap-1 items-end text-sm">
              {!a.isDefault && (
                <button onClick={() => handleSetDefault(a._id)} className="text-brand-accent hover:underline">
                  Set as default
                </button>
              )}
              <button onClick={() => handleEdit(a)} className="text-gray-600 hover:underline">
                Edit
              </button>
              <button onClick={() => handleDelete(a._id)} className="text-red-500 hover:underline">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Addresses;
