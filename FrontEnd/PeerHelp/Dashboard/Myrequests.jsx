import { useEffect, useState } from "react";
import axios from "axios";

function Myrequests() {
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [requests, setRequests] = useState([]);

  const handleCancel = async (rId) => {
    try {
      await axios.delete(
        "http://localhost:8426/api/requests/cancelrequest",
        {
          data: { rId },
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        }
      );
      setRequests((prev) => prev.filter((req) => req.rId !== rId));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to cancel request");
    }
  };

  const fetchMyRequests = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8426/api/requests/outrequests",
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      setRequests(res.data);
    } catch (err) {
      if (!err.response) { setMessage("Network error"); return; }
      switch (err.response.status) {
        case 404: setMessage("No tasks found"); break;
        case 401: setMessage("Unauthorized - please login again"); break;
        case 403: setMessage("Forbidden access"); break;
        case 400: setMessage("No requests found"); break;
        case 500: setMessage("Server error"); break;
        default:  setMessage(err.response.data?.message || "Error");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMyRequests(); }, []);

  if (loading) return <p className="loading-state">Loading...</p>;

  return (
    <div>
      {message && <p className="message">{message}</p>}
      {requests.length === 0 && !message && <p className="empty-state">No requests available</p>}

      <div className="cards-list">
        {requests.map((req) => (
          <div className="card" key={req._id}>
            <p className="card-title">{req.taskId?.title || "N/A"}</p>
            <div className="card-field"><strong>Task Location</strong>{req.taskId?.location || "N/A"}</div>
            <div className="card-field"><strong>Requested To</strong>{req.requestedTo?.username || "N/A"} ({req.requestedTo?.email || ""})</div>
            <div className="card-field"><strong>Description</strong>{req.description}</div>
            <div className="card-field"><strong>Location</strong>{req.location}</div>
            <div className="card-field">
              <strong>Status</strong>
              <span className={`badge badge-${req.status}`}>{req.status}</span>
            </div>
            {req.status === "pending" && (
              <div className="card-actions">
                <button className="btn btn-danger btn-sm" onClick={() => handleCancel(req.rId)}>Cancel</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Myrequests;
