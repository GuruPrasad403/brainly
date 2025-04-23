import mongoose from "mongoose";

enum contentTypes  {
image ="image",
video="video",
article="article",
audio="audio"
}

interface ContentTypes  extends mongoose.Document{
  link: { type: String, required: true },
  type: { type: String, enum: contentTypes, required: true },
  title: { type: String, required: true },
  tags: [{ type: mongoose.Schema.Types.ObjectId, ref: string }],
  userId: { type: mongoose.Schema.Types.ObjectId, ref: string, required: boolean },
}

export {ContentTypes,contentTypes}