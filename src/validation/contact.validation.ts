import { z } from "zod";
import { emailSchema, nameSchema } from "./auth.validation";

export const contactSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  message: z
    .string()
    .trim()
    .min(10, "Message must be at least 10 characters long")
    .max(1000, "Message must be 1000 characters or fewer"),
});
