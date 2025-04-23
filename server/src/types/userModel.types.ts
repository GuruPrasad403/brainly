import mongoose from "mongoose";

interface UserModel extends mongoose.Document{
    name:string,
    password:string,
    email:string,
    created?:Date,
    updated?:Date,
    isValid:boolean
}

export {UserModel}