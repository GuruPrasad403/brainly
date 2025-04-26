"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userSchema = void 0;
const zod_1 = require("zod");
exports.userSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, "Name is required").trim(),
    email: zod_1.z.string().email("Invalid email format"),
    password: zod_1.z
        .string()
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()\-_=+{}[\]|\\:;"',.<>\/~`])[A-Za-z\d@$!%*?&#^()\-_=+{}[\]|\\:;"',.<>\/~`]{8,}$/, "Password must contain at least 1 uppercase, 1 lowercase, 1 number, 1 special character, and be at least 8 characters long"),
    created: zod_1.z.date().optional(),
    updated: zod_1.z.date().optional(),
    isValid: zod_1.z.boolean().optional().default(false),
});
