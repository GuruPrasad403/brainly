import mongoose from "mongoose";
import {TypesInterface} from '../types/tags.types'

const tagSchema = new mongoose.Schema<TypesInterface>({ 
  title: { type: String, required: true, unique: true }
});

const TagModel = mongoose.model<TypesInterface>('TagModel', tagSchema);
export {TagModel};
