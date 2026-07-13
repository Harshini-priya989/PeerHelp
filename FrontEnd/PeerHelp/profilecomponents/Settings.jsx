import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Settings() {
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [user, setUser] = useState({});
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ username: "", phonenumber: "", bio: "" });
  const navigate = useNavigate();

  const fetchMyProfile = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8426/api/settings/profile",
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      setUser(res.data);
      setForm({
        username: res.data.username || "",
        phonenumber: res.data.phonenumber || "",
        bio: res.data.bio || ""
      });
    } catch (err) {
      if (!err.response) { setMessage("Network error"); return; }
      setMessage(err.response.data?.message || "Error loading profile");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      await axios.put(
        "http://localhost:8426/api/settings/updateprofile",
        { username: form.username, phonenumber: form.phonenumber, bio: form.bio },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      setUser({ ...user, ...form });
      setEditing(false);
      setMessage("Profile updated successfully");
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to update profile");
    }
  };

  useEffect(() => { fetchMyProfile(); }, []);

  if (loading) return <p className="loading-state">Loading...</p>;

  return (
    <div>
      {message && (
        <p className={`message ${message.includes("success") ? "message-success" : "message-error"}`}>
          {message}
        </p>
      )}

      <div className="profile-card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h2 className="page-heading" style={{ marginBottom: 0 }}>Profile</h2>
          {!editing && (
            <button className="btn btn-secondary btn-sm" onClick={() => setEditing(true)}>Edit</button>
          )}
        </div>

        {!editing ? (
          <>
            <div className="profile-field">
              <span className="profile-field-label">Username</span>
              <span className="profile-field-value">{user.username || "—"}</span>
            </div>
            <div className="profile-field">
              <span className="profile-field-label">Email</span>
              <span className="profile-field-value">{user.email || "—"}</span>
            </div>
            <div className="profile-field">
              <span className="profile-field-label">Phone</span>
              <span className="profile-field-value">{user.phonenumber || "—"}</span>
            </div>
            <div className="profile-field">
              <span className="profile-field-label">Bio</span>
              <span className="profile-field-value">{user.bio || "—"}</span>
            </div>

            <div style={{ marginTop: "20px" }}>
              <button className="btn btn-secondary btn-sm" onClick={() => navigate("/change-password")}>
                Change Password
              </button>
            </div>
          </>
        ) : (
          <form onSubmit={handleUpdate}>
            <div className="form-group">
              <label className="form-label">Username</label>
              <input
                className="form-input"
                type="text"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                className="form-input"
                type="email"
                value={user.email}
                disabled
                style={{ opacity: 0.5, cursor: "not-allowed" }}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input
                className="form-input"
                type="tel"
                value={form.phonenumber}
                onChange={(e) => setForm({ ...form, phonenumber: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Bio</label>
              <textarea
                className="form-textarea"
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
              />
            </div>

            <div className="card-actions">
              <button className="btn btn-primary btn-sm" type="submit">Save</button>
              <button className="btn btn-secondary btn-sm" type="button" onClick={() => { setEditing(false); setMessage(""); }}>
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default Settings;
