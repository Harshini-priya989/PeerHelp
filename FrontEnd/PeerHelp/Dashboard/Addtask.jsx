import { useState } from "react";
import axios from "axios";

function AddTask() {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        location: "",
        start_time: "",
        end_time: "",
        status: "pending",
        picture: null
    });
    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === "picture") {
            setFormData({ ...formData, picture: files[0] });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.start_time && formData.end_time && formData.end_time <= formData.start_time) {
            setMessage("End time must be after start time");
            return;
        }

        try {
            const data = new FormData();
            data.append("title", formData.title);
            data.append("description", formData.description);
            data.append("location", formData.location);
            data.append("start_time", formData.start_time);
            data.append("end_time", formData.end_time);
            data.append("status", formData.status);
            if (formData.picture) data.append("picture", formData.picture);

            await axios.post(
                "http://localhost:8426/api/tasks/addtask",
                data,
                { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
            );

            setMessage("Task added successfully");
            setFormData({ title: "", description: "", location: "", start_time: "", end_time: "", status: "pending", picture: null });

        } catch (err) {
            setMessage(err.response?.data?.message || "Error adding task");
        }
    };

    return (
        <div className="task-form">
            <h2 className="page-heading">Add Task</h2>

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label className="form-label">Title</label>
                    <input className="form-input" type="text" name="title" value={formData.title} onChange={handleChange} required />
                </div>

                <div className="form-group">
                    <label className="form-label">Description</label>
                    <textarea className="form-textarea" name="description" value={formData.description} onChange={handleChange} required />
                </div>

                <div className="form-group">
                    <label className="form-label">Location</label>
                    <input className="form-input" type="text" name="location" value={formData.location} onChange={handleChange} required />
                </div>

                <div className="form-row-two">
                    <div className="form-group">
                        <label className="form-label">Start Time</label>
                        <input className="form-input" type="datetime-local" name="start_time" value={formData.start_time} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label className="form-label">End Time</label>
                        <input className="form-input" type="datetime-local" name="end_time" value={formData.end_time} onChange={handleChange} required />
                    </div>
                </div>

                <div className="form-group">
                    <label className="form-label">Upload Image</label>
                    <input className="form-input" type="file" name="picture" accept="image/*" onChange={handleChange} />
                </div>

                <button className="btn btn-primary" type="submit">Add Task</button>
            </form>

            {message && <p className="message">{message}</p>}
        </div>
    );
}

export default AddTask;
