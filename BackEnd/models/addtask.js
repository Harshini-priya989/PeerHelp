import { Schema, model } from "mongoose";


const TaskSchema = new Schema({
    uid: {
        type: String,
        required: true,
        index: true
    },
    tid: {
        type: String,
        unique: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true,
        minlength: 20
    },
    location: {
        type: String,
        required: true,
    },
    start_time: {
        type: Date,
        required: true
    },
    end_time: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ["pending", "completed"],
        default: "pending"
    },
    picture: {
        type: String,
        required: false
    },
    isAccepted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

export const Task = model('Task', TaskSchema, 'Task');
