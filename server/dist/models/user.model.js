"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const UserSchema = new mongoose_1.default.Schema({
    name: { type: String, trim: true },
    email: { type: String, unique: true },
    password: { type: String, minlength: 8 },
    created: { type: Date, default: Date.now },
    updated: { type: Date, default: Date.now },
    isValid: { type: Boolean, default: false }
});
const UsersModel = mongoose_1.default.model("UserModel", UserSchema);
exports.default = UsersModel;
