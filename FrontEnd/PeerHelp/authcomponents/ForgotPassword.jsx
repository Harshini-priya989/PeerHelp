import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ForgotPassword() {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSendOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");
        try {
            await axios.post("http://localhost:8426/api/auth/changepasswordotp", { email });
            setMessage("OTP sent to your email");
            setStep(2);
        } catch (err) {
            setMessage(err.response?.data?.message || "Failed to send OTP");
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setMessage("Passwords do not match");
            return;
        }
        setLoading(true);
        setMessage("");
        try {
            await axios.post("http://localhost:8426/api/auth/changepassword", {
                email,
                otp,
                password: newPassword
            });
            setMessage("Password reset successfully. Redirecting to login...");
            setTimeout(() => navigate("/"), 2000);
        } catch (err) {
            setMessage(err.response?.data?.message || "Failed to reset password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <h2 className="auth-title">
                    {step === 1 ? "Forgot password" : "Reset password"}
                </h2>

                {step === 1 && (
                    <form onSubmit={handleSendOtp}>
                        <div className="form-group">
                            <label className="form-label">Registered email</label>
                            <input
                                className="form-input"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <button className="btn btn-primary btn-full" type="submit" disabled={loading}>
                            {loading ? "Sending..." : "Send OTP"}
                        </button>
                    </form>
                )}

                {step === 2 && (
                    <form onSubmit={handleResetPassword}>
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
                        <div className="form-group">
                            <label className="form-label">New password</label>
                            <input
                                className="form-input"
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Confirm new password</label>
                            <input
                                className="form-input"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button className="btn btn-primary btn-full" type="submit" disabled={loading}>
                            {loading ? "Resetting..." : "Reset Password"}
                        </button>
                    </form>
                )}

                {message && <p className="message">{message}</p>}

                <div className="auth-footer">
                    <button className="link-btn" onClick={() => navigate("/")}>Back to login</button>
                </div>
            </div>
        </div>
    );
}

export default ForgotPassword;
