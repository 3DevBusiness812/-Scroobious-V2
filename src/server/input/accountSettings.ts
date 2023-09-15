import { z } from 'zod';

export const updatePasswordInput = z.object({
  oldPassword: z.string().min(8, { message: "Must be at least 8 characters long" }),
  password: z.string().min(8, { message: "Must be at least 8 characters long" }),
  confirmPassword: z.string().min(8, { message: "Must be at least 8 characters long" }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Confirmation doesn't match your new password",
  path: ["confirmPassword"],
}).refine((data) => data.password !== data.oldPassword, {
  message: "Your new password must be different than your current one",
  path: ["password"],
});

export const updateProfileInput = z.object({
  name: z.string().min(1, { message: "Must be at least 1 character long" }),
});

