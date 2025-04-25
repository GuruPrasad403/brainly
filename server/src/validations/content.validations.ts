import { z } from "zod";
import mongoose from "mongoose";

export const contentTypesArray = ["link", "tweet", "article", "youtube"] as const;
export const contentEnum = z.enum(contentTypesArray);

export const contentSchema = z.object({
  link: z.string().url({ message: "Link must be a valid URL" }),
  type: contentEnum,
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().min(1, { message: "Description is required" }), // Add description validation
  tags: z.array(z.string()).optional(),
});

export type ContentValidationType = z.infer<typeof contentSchema>;
