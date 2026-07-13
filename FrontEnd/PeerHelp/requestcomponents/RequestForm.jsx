import { useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

function RequestForm() {
    const routeLocation = useLocation();
    const taskId = routeLocation.state?.taskId;
    const [description, setDescription] = useState("");
    const [location, setLocation] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    if (!taskId) {
        return (
            <div className="task-form">
                <p className="empty-state">No task selected.</p>
                <button className="btn btn-secondary btn-sm" onClick={() => navigate("/dashboard/feed")}>Go to Feed</button>
            </div>
        );
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await axios.post(
                "http://localhost:8426/api/requests/createrequest",
                { description, location, taskId },
                { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
            );

            setMessage("Request sent successfully");
            setDescription("");
            setLocation("");

            setTimeout(() => navigate("/dashboard/feed"), 1500);

        } catch (err) {
            setMessage(err.response?.data?.message || "Error sending request");
        }
    };

    return (
        <div className="task-form">
            <h2 className="page-heading">Send Request</h2>

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label className="form-label">Why are you requesting?</label>
                    <textarea
                        className="form-textarea"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Your location</label>
                    <input
                        className="form-input"
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        required
                    />
                </div>

                <div className="card-actions">
                    <button className="btn btn-primary" type="submit">Send Request</button>
                    <button className="btn btn-secondary" type="button" onClick={() => navigate("/dashboard/feed")}>Cancel</button>
                </div>
            </form>

            {message && <p className="message">{message}</p>}
        </div>
    );
}

export default RequestForm;
