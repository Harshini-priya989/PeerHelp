import nodemailer from "nodemailer";

export const VerifyOTP=async (email,otp)=>{
    console.log(process.env.ADMIN);
    console.log(process.env.ADMINPASS);
    const transporter=nodemailer.createTransport({
        service:"gmail",
        auth:{
            user:process.env.ADMIN,
            pass:process.env.ADMINPASS
        }
    });

    await transporter.sendMail({
        from:process.env.ADMIN,
        to:email,
        subject:"PeerHelp Email Verification",
        html:`
      <h2>Email Verification</h2>
      <p>Your OTP is:</p>
      <h1>${otp}</h1>
      <p>This OTP expires in 5 minutes.</p>
    `

    });
};