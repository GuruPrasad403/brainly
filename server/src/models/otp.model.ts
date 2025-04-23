import mongoose from "mongoose";
import {OtpModel} from '../types/otp.types'
const OtpSchema = new mongoose.Schema<OtpModel>({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"UserModel"
    },
    otp:{
        type:String,
        unique:true,
        required:true,
    },
    created:{
        type:Date,
        default:Date.now()
    },
    expireAt: { type: Date, default: Date.now, expires: 10000 }, // expires in 10 min
})      

export const OtpsModel = mongoose.model<OtpModel>("OtpModel",OtpSchema)