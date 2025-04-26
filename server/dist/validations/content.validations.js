"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.contentSchema = exports.contentEnum = exports.contentTypesArray = void 0;
const zod_1 = require("zod");
exports.contentTypesArray = ["link", "tweet", "article", "youtube"];
exports.contentEnum = zod_1.z.enum(exports.contentTypesArray);
exports.contentSchema = zod_1.z.object({
    link: zod_1.z.string().url({ message: "Link must be a valid URL" }),
    type: exports.contentEnum,
    title: zod_1.z.string().min(1, { message: "Title is required" }),
    description: zod_1.z.string().min(1, { message: "Description is required" }), // Add description validation
    tags: zod_1.z.array(zod_1.z.string()).optional(),
});
