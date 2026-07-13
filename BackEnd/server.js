import express from "express";
import connectDB from "./config/db.js";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import reqRoutes from "./routes/requestRoutes.js";
import Profile from "./routes/profileRoutes.js";
dotenv.config();
import cors from "cors";
const app = express();
app.use(
    cors({
        origin: "http://localhost:5173",
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true
    })
);
const port = 8426;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB().then(()=>{
    app.listen(port,()=>{
        console.log(`Server running on http://localhost:${port}`);
    });
})
.catch(err=>console.log(err));

app.get("/",(req,res)=>{
    res.status(200).json({Message:"succesfully connected"});
});

app.use("/api/auth",authRoutes);
app.use("/api/tasks",taskRoutes);
app.use("/api/requests",reqRoutes);
app.use("/api/settings",Profile);




























