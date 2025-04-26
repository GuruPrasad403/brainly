"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OtpsModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const OtpSchema = new mongoose_1.default.Schema({
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true,
        ref: "UserModel"
    },
    otp: {
        type: String,
        unique: true,
        required: true,
    },
    created: {
        type: Date,
        default: Date.now()
    },
    expireAt: { type: Date, default: Date.now, expires: 10000 }, // expires in 10 min
});
exports.OtpsModel = mongoose_1.default.model("OtpModel", OtpSchema);
