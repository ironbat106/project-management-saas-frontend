import { z } from "zod";

export const projectBasicsSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Project name must be at least 2 characters long")
    .max(150, "Project name must be 150 characters or fewer"),
  description: z
    .string()
    .trim()
    .max(1000, "Description must be 1000 characters or fewer"),
});

const scheduleFields = z.object({
  teamId: z.string(),
  startDate: z.string(),
  endDate: z.string(),
});

const endAfterStart = (data: { startDate: string; endDate: string }) =>
  !data.startDate || !data.endDate || data.endDate >= data.startDate;

const endAfterStartMessage = {
  message: "End date must be on or after the start date",
  path: ["endDate"],
};

export const projectScheduleSchema = scheduleFields.refine(
  endAfterStart,
  endAfterStartMessage,
);

export const projectSchema = projectBasicsSchema
  .extend(scheduleFields.shape)
  .refine(endAfterStart, endAfterStartMessage);

export const sprintSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Sprint name must be at least 2 characters long")
      .max(100, "Sprint name must be 100 characters or fewer"),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().min(1, "End date is required"),
  })
  .refine((data) => data.endDate > data.startDate, {
    message: "End date must be after the start date",
    path: ["endDate"],
  });

export type ProjectBasicsValues = z.infer<typeof projectBasicsSchema>;
export type ProjectScheduleValues = z.infer<typeof projectScheduleSchema>;
export type ProjectValues = z.infer<typeof projectSchema>;
