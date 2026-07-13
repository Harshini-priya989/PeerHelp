import { Task } from "../models/addtask.js";
import {nanoid} from "nanoid";



export const addTask = async (req, res) => {
  try {
    const { title, description, location, start_time, end_time, status } = req.body;

    const picture = req.file?.filename;
    
    const uid = req.user.uid;

    const task = new Task({
        uid,
        tid: "TASK_"+
        nanoid(8),
      title,
      description,
      location,
      start_time,
      end_time,
      status,
      picture
    });

    await task.save();

    return res.status(201).json({
      message: "Task created successfully"
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Server error"
    });
  }
};
export const allTasks=async (req,res)=>{
    try{
        const userid=req.user.uid;
        const alltasks=await Task.find({isAccepted:false,uid:{$ne:userid}});
        return res.status(200).json({
            count:alltasks.length,
            tasks:alltasks
        })
    }
    catch(error){
        console.log(error);

        return res.status(500).json({
            message:"Error retrieving tasks"
        });
    }
};
export const deleteTask=async (req,res)=>{
    try{
        const {tid} = req.params;
        const userid = req.user.uid;
        const task = await Task.findOne({tid, uid:userid});
        if(!task){
            return res.status(404).json({message:"Task not found"});
        }
        if(task.isAccepted){
            return res.status(400).json({message:"Cannot delete a task that has already been accepted"});
        }
        await Task.deleteOne({tid});
        return res.status(200).json({message:"Task deleted successfully"});
    }catch(error){
        console.log(error);
        return res.status(500).json({message:"Server error"});
    }
};

export const myTasks=async (req,res)=>{
    try{
         if (!req.user?.uid) {
            return res.status(401).json({
                message: "Invalid user token"
            });
        }
        const userid=req.user.uid;
        const mytasks=await Task.find({uid:userid});
        return res.status(200).json({
            count:mytasks.length,
            tasks:mytasks
        });
    }
    
    catch(error){
        console.log(error);

        return res.status(500).json({
            message:"Error retrieving tasks"
        });
    }
}