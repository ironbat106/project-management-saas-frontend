import { z } from "zod";
import { emailSchema, nameSchema } from "./auth.validation";

export const organizationSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Organization name must be at least 2 characters long")
    .max(100, "Organization name must be 100 characters or fewer"),
  description: z
    .string()
    .trim()
    .max(500, "Description must be 500 characters or fewer"),
});

export const inviteMemberSchema = z.object({
  name: nameSchema,
  email: emailSchema,
});

export const teamSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Team name must be at least 2 characters long")
    .max(100, "Team name must be 100 characters or fewer"),
});

export const addTeamMemberSchema = z.object({
  userId: z.string().min(1, "Select a member to add"),
});
