import { z } from "zod";

export const signInSchema = z.object({
  email: z.email("Please enter a valid email address"),
  password: z.string().trim().min(1, "Password is required"),
});

export type SignInFormData = z.infer<typeof signInSchema>;
