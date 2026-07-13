import { useEffect, useState } from "react";
import axios from "axios";

function Requests() {
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [requests, setRequests] = useState([]);

  const fetchMyRequests = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8426/api/requests/inrequests",
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

  const handleAccept = async (rId) => {
    try {
      const acceptedTaskId = requests.find(r => r.rId === rId)?.taskId?._id;
      await axios.put(
        "http://localhost:8426/api/requests/acceptedrequests",
        { rId },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      setRequests((prev) =>
        prev.map((req) =>
          req.rId === rId
            ? { ...req, status: "accepted" }
            : req.status === "pending" && req.taskId?._id === acceptedTaskId
            ? { ...req, status: "rejected" }
            : req
        )
      );
    } catch (err) {
      alert(err.response?.data?.message || "Failed to accept request");
    }
  };

  const handleReject = async (rId) => {
    try {
      await axios.put(
        "http://localhost:8426/api/requests/rejectrequest",
        { rId },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      setRequests((prev) =>
        prev.map((req) => req.rId === rId ? { ...req, status: "rejected" } : req)
      );
    } catch (err) {
      alert(err.response?.data?.message || "Failed to reject request");
    }
  };

  useEffect(() => { fetchMyRequests(); }, []);

  if (loading) return <p className="loading-state">Loading...</p>;

  return (
    <div>
      {message && <p className="message">{message}</p>}
      {requests.length === 0 && !message && <p className="empty-state">No incoming requests</p>}

      <div className="cards-list">
        {requests.map((req) => (
          <div className="card" key={req._id}>
            <p className="card-title">{req.taskId?.title || "N/A"}</p>
            <div className="card-field"><strong>From</strong>{req.requestedBy?.username || "N/A"} ({req.requestedBy?.email || ""})</div>
            <div className="card-field"><strong>Description</strong>{req.description}</div>
            <div className="card-field"><strong>Location</strong>{req.location}</div>
            <div className="card-field">
              <strong>Status</strong>
              <span className={`badge badge-${req.status}`}>{req.status}</span>
            </div>
            {req.status === "pending" && (
              <div className="card-actions">
                <button className="btn btn-success btn-sm" onClick={() => handleAccept(req.rId)}>Accept</button>
                <button className="btn btn-danger btn-sm" onClick={() => handleReject(req.rId)}>Reject</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Requests;
