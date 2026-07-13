import { Schema,model } from "mongoose";

const userSchema = new Schema({
    uid:{
        type:String,
        unique:true,
    },
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        minlength:8,
    },
    phonenumber:{
        type:Number,
        minlength:10
    },
    otp:{
        type:String
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    otpExpires:{
        type:Date
    },
    bio:{
        type:String,
        minlength:10,
        trim:true,
        default:"enter your bio"
    }
},{timestamps:true});

export const User = model('User',userSchema,'User');
