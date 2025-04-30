"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContentModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const contnet_types_1 = require("../types/contnet.types");
const ContentSchema = new mongoose_1.default.Schema({
    link: { type: String, required: true },
    type: { type: String, enum: contnet_types_1.contentTypes, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    tags: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: "TagModel" }],
    userId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "UserModel", required: true },
    embedding: { type: [Number], required: true }
});
const ContentModel = mongoose_1.default.model("ContentModel", ContentSchema);
exports.ContentModel = ContentModel;
