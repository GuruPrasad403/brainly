import mongoose from "mongoose";


interface LinkType extends mongoose.Document{
    userId :{ type:mongoose.Schema.Types.ObjectId, ref:string, required:boolean };
    contentId :{ type:mongoose.Schema.Types.ObjectId, ref:string, required:boolean, unique:boolean };
    createdAt :{ type:Date, default:Date };
    updatedAt :{ type:Date, default:Date };
} 


export default LinkType;