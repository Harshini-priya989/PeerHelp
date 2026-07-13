import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Signup() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [phonenumber, setPhonenumber] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await axios.post(
                "http://localhost:8426/api/auth/signup",
                { username, email, password, phonenumber }
            );

            setMessage("OTP sent to your email");
            navigate("/OTPVerification", { state: { email } });

        } catch (err) {
            if (!err.response) { setMessage("Network error"); return; }
            switch (err.response.status) {
                case 400: setMessage("Email already exists"); break;
                case 500: setMessage("Server error"); break;
                default:  setMessage(err.response.data.message || "Error");
            }
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <h2 className="auth-title">Create account</h2>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Username</label>
                        <input
                            className="form-input"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>

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
                        <label className="form-label">Phone Number</label>
                        <input
                            className="form-input"
                            type="tel"
                            value={phonenumber}
                            onChange={(e) => setPhonenumber(e.target.value)}
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

                    <button className="btn btn-primary btn-full" type="submit">Sign up</button>
                </form>

                {message && <p className="message">{message}</p>}

                <div className="auth-footer">
                    Already have an account?&nbsp;
                    <button className="link-btn" onClick={() => navigate("/")}>Sign in</button>
                </div>
            </div>
        </div>
    );
}

export default Signup;
