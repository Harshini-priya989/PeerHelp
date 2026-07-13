import { Request } from "../models/request.js";
import { Task } from "../models/addtask.js";
import { User } from "../models/user.js";
import { nanoid } from "nanoid";

export const createRequest =async(req,res) =>{
    try{
        const {description,location,taskId}=req.body;

        const task = await Task.findOne({_id:taskId});
        if (!task){
            return res.status(404).json({message:"task not found"})
        }
        const userid=await User.findOne({uid:task.uid});
        if (!userid){
            return res.status(404).json({message:"Task owner not found"});
        }

        const requ = new Request({
            rId:"REQ_"+nanoid(8),
            description:description,
            location:location,
            requestedBy:req.user._id,
            requestedTo:userid._id,
            taskId:task._id
        });
        await requ.save();
        return res.status(200).json(requ);
    }catch(error){
        console.log(error);
        if(error.name==="ValidationError"){
            return res.status(400).json({message:"Invalid data"});
        }
        if(error.name==="CastError"){
            return res.status(400).json({message:"Invalid ID format"});
        }
        return res.status(500).json({message:"Server error"});
    }
};

export const InReq = async (req, res) => {
  try {
    const uid = req.user._id;

    const requests = await Request.find({ requestedTo: uid })
      .populate("taskId", "title description location start_time end_time")
      .populate("requestedBy", "username email");

    return res.status(200).json(requests);

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error" });
  }
};


export const OutReq = async (req, res) => {
  try {
    const uid = req.user._id;

    const requests = await Request.find({ requestedBy: uid })
      .populate("taskId", "title description location start_time end_time")
      .populate("requestedTo", "username email");

    return res.status(200).json(requests);

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const cancelrequest = async(req,res)=>{
    try{
        const {rId} = req.body;
        const request = await Request.findOne({rId, requestedBy:req.user._id});
        if (!request){
            return res.status(404).json({message:"Request not found"});
        }
        if(request.status !== "pending"){
            return res.status(400).json({message:"Only pending requests can be cancelled"});
        }
        await Request.deleteOne({rId});
        return res.status(200).json({message:"Request cancelled"});
    }catch(error){
        console.log(error);
        if(error.name==="CastError"){
            return res.status(400).json({message:"Invalid ID format"});
        }
        return res.status(500).json({message:"Server error"});
    }
};

export const rejectrequest = async(req,res)=>{
    try{
        const {rId} = req.body;
        const request = await Request.findOne({rId});
        if (!request){
            return res.status(404).json({message:"Request not found"});
        }
        if(request.status !== "pending"){
            return res.status(400).json({message:"Only pending requests can be rejected"});
        }
        request.status = "rejected";
        await request.save();
        return res.status(200).json({message:"Request rejected"});
    }catch(error){
        console.log(error);
        if(error.name==="CastError"){
            return res.status(400).json({message:"Invalid ID format"});
        }
        return res.status(500).json({message:"Server error"});
    }
};

export const acceptrequest = async(req,res)=>{
    try{
        const {rId} = req.body;
        const request = await Request.findOne({rId});
        if (!request){
            return res.status(404).json({message:"not found!"});
        }
        const {requestedBy,taskId}=request;
        const task = await Task.findOneAndUpdate({_id:taskId,isAccepted:false},{isAccepted:true},{new:true});
        if (!task) {
            return res.status(400).json({
                message: "Task already accepted by someone else"
            });
        }
        request.status = "accepted";
        await request.save();
        await Request.updateMany({taskId:taskId, status:"pending"}, {$set:{status:"rejected"}});
        return res.status(200).json({message:"Request accepted successfully"});
    }catch(error){
        console.log(error);
        if(error.name==="CastError"){
            return res.status(400).json({message:"Invalid ID format"});
        }
        return res.status(500).json({message:"Server error"});
    }
};
