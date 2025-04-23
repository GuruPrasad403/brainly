import mongoose from "mongoose";
import { UserModel } from "./userModel.types";
interface OtpModel extends mongoose.Document, UserModel{
    userId : mongoose.Schema.Types.ObjectId,
    otp:string,
    expireAt?:Date
    created:Date,
} 

export {OtpModel}