import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Changepassword() {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        if (message === "Password changed successfully") {
            const timer = setTimeout(() => navigate("/"), 2000);
            return () => clearTimeout(timer);
        }
    }, [message]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            setMessage("New password and confirm password do not match");
            return;
        }

        try {
            const res = await axios.post(
                "http://localhost:8426/api/settings/changepassword",
                { currentPassword, newPassword },
                { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
            );
            setMessage(res.data.message);
        } catch (err) {
            setMessage(err.response?.data?.message || "Failed to change password");
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <h2 className="auth-title">Change password</h2>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Current password</label>
                        <input className="form-input" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label className="form-label">New password</label>
                        <input className="form-input" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Confirm new password</label>
                        <input className="form-input" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                    </div>

                    <button className="btn btn-primary btn-full" type="submit">Change Password</button>
                </form>

                {message && <p className="message">{message}</p>}
            </div>
        </div>
    );
}

export default Changepassword;
