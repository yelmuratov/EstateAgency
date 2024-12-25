import * as z from "zod"

export const emailSchema = z.object({
  email: z.string().email("Please enter a valid email address")
})

export const codeSchema = z.object({
  code: z.string().length(6, "Code must be 6 characters")
})

export const passwordSchema = z.object({
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
})

export type EmailSchema = z.infer<typeof emailSchema>
export type CodeSchema = z.infer<typeof codeSchema>
export type PasswordSchema = z.infer<typeof passwordSchema>