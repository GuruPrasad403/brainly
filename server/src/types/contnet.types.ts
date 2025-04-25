import mongoose from "mongoose";

enum contentTypes  {
link ="link",
tweet="tweet",
article="article",
youtube="youtube"
}

interface ContentTypes  extends mongoose.Document{
  link: { type: String, required: true },
  type: { type: String, enum: contentTypes, required: true },
  title: { type: String, required: true },
  tags: [{ type: mongoose.Schema.Types.ObjectId, ref: string }],
  description :{type: String, required: true},
  userId: { type: mongoose.Schema.Types.ObjectId, ref: string, required: boolean },
}

export {ContentTypes,contentTypes}