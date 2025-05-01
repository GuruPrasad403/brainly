import mongoose from "mongoose";
import LinkType from "../types/link.types";

const LinkSchema = new mongoose.Schema<LinkType>({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "UserModel", required: true },
  contentId: { type: mongoose.Schema.Types.ObjectId, ref: "ContentModel", required: true, unique: true },
}, {
  timestamps: true
});

export const LinkModel = mongoose.model<LinkType>("LinkModel", LinkSchema);
