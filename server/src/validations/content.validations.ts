import { z } from "zod";
import mongoose from "mongoose";

export const contentTypesArray = ["image", "video", "article", "audio"] as const;
export const contentEnum = z.enum(contentTypesArray);

export const contentSchema = z.object({
  link: z.string().url({ message: "Link must be a valid URL" }),
  type: contentEnum,
  title: z.string().min(1, { message: "Title is required" }),
  tags: z
    .array(z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
      message: "Each tag must be a valid ObjectId",
    }))
    .optional(),
  userId: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: "UserId must be a valid ObjectId",
  }),
});

export type ContentValidationType = z.infer<typeof contentSchema>;
