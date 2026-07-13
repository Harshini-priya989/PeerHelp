import { useEffect, useState } from "react";
import axios from "axios";

function Mytasks() {
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [tasks, setTasks] = useState([]);

  const handleDelete = async (tid) => {
    try {
      await axios.delete(
        `http://localhost:8426/api/tasks/deletetask/${tid}`,
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      setTasks((prev) => prev.filter((task) => task.tid !== tid));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete task");
    }
  };

  const fetchMyTasks = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8426/api/tasks/mytasks",
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      setTasks(res.data.tasks);
    } catch (err) {
      if (!err.response) { setMessage("Network error"); return; }
      switch (err.response.status) {
        case 404: setMessage("No tasks found"); break;
        case 401: setMessage("Unauthorized - please login again"); break;
        case 403: setMessage("Forbidden access"); break;
        case 500: setMessage("Server error"); break;
        default:  setMessage(err.response.data?.message || "Error");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMyTasks(); }, []);

  if (loading) return <p className="loading-state">Loading...</p>;

  return (
    <div>
      {message && <p className="message">{message}</p>}
      {tasks.length === 0 && !message && <p className="empty-state">No tasks found</p>}

      <div className="cards-list">
        {tasks.map((task) => (
          <div className="card" key={task._id}>
            <p className="card-title">{task.title}</p>
            <div className="card-field"><strong>Description</strong>{task.description}</div>
            <div className="card-field"><strong>Location</strong>{task.location}</div>
            <div className="card-field"><strong>Start</strong>{new Date(task.start_time).toLocaleString()}</div>
            <div className="card-field"><strong>End</strong>{new Date(task.end_time).toLocaleString()}</div>
            <div className="card-field">
              <strong>Status</strong>
              <span className={`badge badge-${task.status}`}>{task.status}</span>
            </div>
            <div className="card-field">
              <strong>Accepted</strong>
              <span className={`badge ${task.isAccepted ? "badge-accepted" : "badge-pending"}`}>
                {task.isAccepted ? "Yes" : "No"}
              </span>
            </div>
            {!task.isAccepted && (
              <div className="card-actions">
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(task.tid)}>Delete Task</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Mytasks;
