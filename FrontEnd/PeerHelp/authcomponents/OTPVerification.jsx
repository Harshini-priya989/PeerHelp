import { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

function OTPVerify() {
    const [otp, setOtp] = useState("");
    const [message, setMessage] = useState("");

    const location = useLocation();
    const navigate = useNavigate();
    const email = location.state?.email;

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email) {
            setMessage("Email missing. Please signup again.");
            return;
        }

        try {
            await axios.post(
                "http://localhost:8426/api/auth/verifyotp",
                { email, otp }
            );

            setMessage("Email verified successfully");
            navigate("/");

        } catch (err) {
            if (!err.response) { setMessage("Network error"); return; }
            switch (err.response.status) {
                case 404: setMessage("User not found"); break;
                case 400: setMessage(err.response.data.message); break;
                case 500: setMessage("Server error"); break;
                default:  setMessage(err.response.data.message || "Error");
            }
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <h2 className="auth-title">Verify your email</h2>
                <p style={{ fontSize: "13px", color: "#71717a", marginBottom: "20px" }}>
                    Enter the OTP sent to <strong>{email}</strong>
                </p>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">OTP</label>
                        <input
                            className="form-input"
                            type="text"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            required
                        />
                    </div>

                    <button className="btn btn-primary btn-full" type="submit">Verify</button>
                </form>

                {message && <p className="message">{message}</p>}
            </div>
        </div>
    );
}

export default OTPVerify;
