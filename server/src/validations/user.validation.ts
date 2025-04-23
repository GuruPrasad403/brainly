
import { z } from "zod";

export const userSchema = z.object({
  name: z.string().min(1, "Name is required").trim(),
  email: z.string().email("Invalid email format"),
  password: z
    .string()
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()\-_=+{}[\]|\\:;"',.<>\/~`])[A-Za-z\d@$!%*?&#^()\-_=+{}[\]|\\:;"',.<>\/~`]{8,}$/,
      "Password must contain at least 1 uppercase, 1 lowercase, 1 number, 1 special character, and be at least 8 characters long"
    ),
  created: z.date().optional(),
  updated: z.date().optional(),
  isValid: z.boolean().optional().default(false),
});

// Optional: Inferred TypeScript type from the Zod schema
export type UserValidationType = z.infer<typeof userSchema>;
