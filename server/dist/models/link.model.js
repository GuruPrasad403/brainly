"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LinkModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const LinkSchema = new mongoose_1.default.Schema({
    userId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "UserModel", required: true },
    contentId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "ContentModel", required: true, unique: true },
}, {
    timestamps: true
});
exports.LinkModel = mongoose_1.default.model("LinkModel", LinkSchema);
