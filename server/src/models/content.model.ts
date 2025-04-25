import mongoose from "mongoose";
import { ContentTypes, contentTypes } from "../types/contnet.types";

const ContentSchema = new mongoose.Schema<ContentTypes>({
  link: { type: String, required: true },
  type: { type: String, enum: contentTypes, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true }, // Add description field
  tags: [{ type: mongoose.Schema.Types.ObjectId, ref: "TagModel" }],
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "UserModel", required: true },
});

const ContentModel = mongoose.model<ContentTypes>("ContentModel", ContentSchema);

export { ContentModel };
