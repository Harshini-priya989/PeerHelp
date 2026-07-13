import mongoose, { Schema,model } from "mongoose";

const reqSchenma = new Schema({
    rId:{
        type:String,
        unique:true
    },
    description:{
        type:String,
        required:true,
        minlength:30
    },
    location:{
        type:String,
        required:true,
    },
    requestedBy: {
        type:Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    requestedTo: {
        type:Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    taskId: {
        type:Schema.Types.ObjectId,
        ref: "Task",
        required: true
    },
    status: {
        type: String,
        enum: ["pending", "accepted", "rejected"],
        default: "pending"
    }

},{timestamps:true});

export const Request=model('Requests',reqSchenma,'Requests');
 