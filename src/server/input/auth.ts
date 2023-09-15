import { z } from 'zod';

export const resetPasswordInput = z.object({
  password: z.string().min(8, { message: "Must contain at least 8 characters" }),
  confirmPassword: z.string().min(8, { message: "Must contain at least 8 characters" }),
  token: z.string().length(64)
}).refine((data) => data.password === data.confirmPassword, {
  message: "Confirmation doesn't match password",
  path: ["confirmPassword"], // path of error
});

export const createPasswordResetInput = z.object({
  email: z.string().email().min(1, { message: "Required" }),
})
