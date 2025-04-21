import { z } from "zod";
import dayjs from "dayjs";

export const userSchema = z.object({
  name: z
    .string()
    .min(1, "Name must be at least 1 character")
    .transform((val) => val?.trim() ?? ""), // Handles null/undefined
  email: z.string().trim().email("Invalid email address"),
  phone: z
    .string()
    .trim()
    .regex(/^[1-9]\d{9}$/, "Invalid Phone Number"),
  password: z
    .string()
    .trim()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
});

export const tableSchema = z
  .object({
    bookingDate: z
      .string()
      .refine((val) => dayjs(val, "DD-MM-YYYY").isValid(), {
        message: "Invalid date format. Use DD-MM-YYYY"
      }),
    partySize: z.number().min(1, "Party size must be at least 1"),
    startTime: z
      .string()
      .refine((val) => dayjs(`2000-01-01T${val}`).isValid(), {
        message: "Invalid time format. Use HH:mm"
      }),
    endTime: z.string().refine((val) => dayjs(`2000-01-01T${val}`).isValid(), {
      message: "Invalid time format. Use HH:mm"
    })
  })
  .refine(
    (data) => {
      const start = dayjs(`2000-01-01T${data.startTime}`);
      const end = dayjs(`2000-01-01T${data.endTime}`);
      return end.isAfter(start);
    },
    {
      message: "End time must be greater than start time",
      path: ["endTime"]
    }
  );
