import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await axios.post(
                "http://localhost:8426/api/auth/login",
                { email, password }
            );

            localStorage.setItem("token", res.data.token);
            setMessage("Login successful");
            navigate("/dashboard/feed");

        } catch (err) {
            if (!err.response) { setMessage("Network error"); return; }
            switch (err.response.status) {
                case 404: setMessage("User not registered"); break;
                case 401: setMessage("Invalid password"); break;
                case 403: setMessage("Verify your email before login"); break;
                case 500: setMessage("Server error"); break;
                default:  setMessage(err.response.data.message || "Error");
            }
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <h2 className="auth-title">Sign in</h2>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Email</label>
                        <input
                            className="form-input"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <input
                            className="form-input"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button className="btn btn-primary btn-full" type="submit">Login</button>
                </form>

                {message && <p className="message">{message}</p>}

                <div className="auth-footer">
                    <button className="link-btn" onClick={() => navigate("/forgot-password")}>Forgot password?</button>
                    &nbsp;·&nbsp;
                    <button className="link-btn" onClick={() => navigate("/signup")}>Create account</button>
                </div>
            </div>
        </div>
    );
}

export default Login;
