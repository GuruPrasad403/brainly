import mongoose from "mongoose";


interface TypesInterface extends mongoose.Document{
    title : {
        type:String,
        unique:boolean,
        required:boolean
    }
}


export {TypesInterface}