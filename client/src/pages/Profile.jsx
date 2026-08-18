import { useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({ name: user.name, phone: user.phone || "" });
  const [pwForm, setPwForm] = useState({ currentPassword: "", newPassword: "" });
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPw, setSavingPw] = useState(false);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const { data } = await api.put("/auth/me", form);
      updateUser(data.user);
      toast.success("Profile updated");
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not update profile");
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setSavingPw(true);
    try {
      await api.put("/auth/change-password", pwForm);
      toast.success("Password changed successfully");
      setPwForm({ currentPassword: "", newPassword: "" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not change password");
    } finally {
      setSavingPw(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      <h1 className="text-2xl font-bold">My Profile</h1>

      <form onSubmit={handleProfileSubmit} className="card p-6 space-y-4">
        <h2 className="font-semibold">Personal Information</h2>
        <div>
          <label className="text-sm font-medium block mb-1">Name</label>
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="input-field"
          />
        </div>
        <div>
          <label className="text-sm font-medium block mb-1">Email</label>
          <input value={user.email} disabled className="input-field bg-gray-100" />
        </div>
        <div>
          <label className="text-sm font-medium block mb-1">Phone</label>
          <input
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="input-field"
          />
        </div>
        <button type="submit" disabled={savingProfile} className="btn-primary">
          {savingProfile ? "Saving..." : "Save Changes"}
        </button>
      </form>

      <form onSubmit={handlePasswordSubmit} className="card p-6 space-y-4">
        <h2 className="font-semibold">Change Password</h2>
        <div>
          <label className="text-sm font-medium block mb-1">Current Password</label>
          <input
            type="password"
            required
            value={pwForm.currentPassword}
            onChange={(e) => setPwForm({ ...pwForm, currentPassword: e.target.value })}
            className="input-field"
          />
        </div>
        <div>
          <label className="text-sm font-medium block mb-1">New Password</label>
          <input
            type="password"
            required
            minLength={6}
            value={pwForm.newPassword}
            onChange={(e) => setPwForm({ ...pwForm, newPassword: e.target.value })}
            className="input-field"
          />
        </div>
        <button type="submit" disabled={savingPw} className="btn-primary">
          {savingPw ? "Updating..." : "Update Password"}
        </button>
      </form>
    </div>
  );
};

export default Profile;
