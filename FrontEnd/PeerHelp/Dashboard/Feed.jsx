import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Feed() {
    const [data, setData] = useState([]);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchTasks = async () => {
        try {
            const res = await axios.get("http://localhost:8426/api/tasks/feed", {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });
            setData(res.data.tasks);
            setMessage("");
        } catch (err) {
            if (!err.response) { setMessage("Network error"); return; }
            switch (err.response.status) {
                case 404: setMessage("No tasks found"); break;
                case 401: setMessage("Unauthorized - please login again"); break;
                case 403: setMessage("Forbidden access"); break;
                case 500: setMessage("Server error"); break;
                default:  setMessage(err.response.data.message || "Error");
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchTasks(); }, []);

    if (loading) return <p className="loading-state">Loading...</p>;

    return (
        <div>
            {message && <p className="message">{message}</p>}
            {!message && data.length === 0 && <p className="empty-state">No tasks available</p>}

            <div className="cards-list">
                {data.map((item) => (
                    <div className="card" key={item._id}>
                        <p className="card-title">{item.title}</p>
                        <div className="card-field"><strong>Description</strong>{item.description}</div>
                        <div className="card-field"><strong>Location</strong>{item.location}</div>
                        <div className="card-field"><strong>Start</strong>{new Date(item.start_time).toLocaleString()}</div>
                        <div className="card-field"><strong>End</strong>{new Date(item.end_time).toLocaleString()}</div>
                        <div className="card-field">
                            <strong>Status</strong>
                            <span className={`badge badge-${item.status}`}>{item.status}</span>
                        </div>
                        <div className="card-actions">
                            <button
                                className="btn btn-primary btn-sm"
                                onClick={() => navigate('/dashboard/requestform', { state: { taskId: item._id } })}
                            >
                                Send Request
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Feed;
