import mongoose from "mongoose";
import { Task } from "../models/addtask.js";

// const syncTaskCollection = async () => {
//     const existingCollections = await mongoose.connection.db
//         .listCollections({ name: Task.collection.collectionName })
//         .toArray();

//     if (existingCollections.length > 0) {
//         const indexes = await Task.collection.indexes();
//         const uidIndex = indexes.find((index) => index.name === "uid_1");

//         if (uidIndex?.unique) {
//             await Task.collection.dropIndex("uid_1");
//         }

//         await Task.collection.updateMany(
//             { uid: { $exists: false }, cuid: { $exists: true, $ne: null } },
//             [{ $set: { uid: "$cuid" } }]
//         );
//     }

//     await Task.syncIndexes();
// };

const connectDB = async()=>{
    try{
     await mongoose.connect(process.env.uri);
     //await syncTaskCollection();
     console.log(`database connected on the port:${process.env.port}`);
    }catch(err){
        console.log(`DB connection error : ${err.message}`);
        process.exit(1);
    }
};

export default connectDB;
