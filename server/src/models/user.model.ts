import mongoose from "mongoose";
import { UserModel } from "../types/userModel.types";

const UserSchema = new mongoose.Schema<UserModel>({
  name: { type: String, trim: true },
  email: { type: String, unique: true },
  password: { type: String, minlength: 8 },
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now },
  isValid: { type: Boolean, default: false }
});


const UsersModel= mongoose.model<UserModel>("UserModel", UserSchema)
export default UsersModel