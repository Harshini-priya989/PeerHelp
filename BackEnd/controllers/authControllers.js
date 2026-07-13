import { User } from "../models/user.js";
import bcrypt from "bcrypt";
import { VerifyOTP } from "../utils/VerifyOTP.js";
import {v4 as uuidv4} from "uuid";
import jwt from "jsonwebtoken";

export const registerUser = async (req, res) => {
    try {
        const { username, email, password, phonenumber } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                message: "Email already exists"
            });
        }
        const hp = await bcrypt.hash(password, 10);
        const otp = Math.floor(1000 + Math.random() * 9000).toString();
        const user = new User({
            username: username,
            email: email,
            password: hp,
            phonenumber: phonenumber,
            otp: otp,
            otpExpires: Date.now() + 5 * 60 * 1000
        });
        await user.save();
        await VerifyOTP(email, otp);
        res.status(201).json({
            message: "User received successfully",
            otpstatus: "OTP SENT SUCCESSFULLY"
        });



    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Database error"
        });

    }
};

export const otpVerify = async (req, res) => {
    try {

        const { email, otp } = req.body;

        console.log("before db");

        const user = await User.findOne({ email });

        console.log("after db");

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        if (user.otp !== otp) {
            return res.status(400).json({
                message: "Invalid OTP"
            });
        }

        if (user.otpExpires < Date.now()) {
            return res.status(401).json({
                message: "OTP expired"
            });
        }

        // ✅ verification happens here
        user.isVerified = true;
        user.uid = uuidv4();
        user.otp = null;
        user.otpExpires = null;

        await user.save();

        return res.json({
            message: "Email verified successfully"
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Server error"
        });
    }
};
export const login=async (req,res)=>{
    try{
        const { email, password } = req.body;
        const exuser =await User.findOne({ email });
        if (!exuser) {
            return res.status(404).json({
                message: "User not registered"
            });
        };
        const isMatch = await bcrypt.compare(password, exuser.password);
        if (!isMatch) {
            return res.status(401).json({
                message: "Password is invalid"
            })
        };
        if (!exuser.isVerified || !exuser.uid) {
            return res.status(403).json({
                message: "Verify your email before logging in"
            });
        }
        const token = jwt.sign(
            {_id:exuser._id,uid:exuser.uid,email:exuser.email},
            process.env.JWT_SECRET,
            {expiresIn:"1d"}
        );
        return res.status(200).json({
            message: "Login successful",
            token
        });

    }
    catch(error){
        console.log("Error in Login:", error);

        return res.status(500).json({
            message:"Server error"});
    };
    
}

export const passwordChangeV = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email }); // ✅ await added
        if (!user) {
            return res.status(404).json({ message: "Email not registered" });
        }

        const otp = Math.floor(1000 + Math.random() * 9000).toString();

        user.otp = otp;
        user.otpExpires = Date.now() + 5 * 60 * 1000; // 5 mins

        await user.save(); // ✅ important

        await VerifyOTP(email, otp);

        return res.status(200).json({
            message: "OTP sent successfully"
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Server error" });
    }
};
export const passwordChangeP = async (req, res) => {
    try {
        const { email, otp, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        // OTP validation
        if (user.otp !== otp) {
            return res.status(400).json({
                message: "Invalid OTP"
            });
        }

        if (user.otpExpires < Date.now()) {
            return res.status(400).json({
                message: "OTP expired"
            });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(password, 10);

        user.password = hashedPassword;

        // Clear OTP after use
        user.otp = null;
        user.otpExpires = null;

        await user.save();

        return res.status(200).json({
            message: "Password reset successful"
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Server error"
        });
    }
};
