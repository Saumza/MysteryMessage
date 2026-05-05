import { z } from "zod";

export const usernameValidation = z.string()
    .min(2, { message: "Username must have atleast 2 characters" })
    .max(15, { message: "Username must not be above 15 characters" })
    .regex(/^[a-zA-Z0-9_]+$/, { message: "Username must not have any special characters" })

export const signUpValidation = z.object({
    username: usernameValidation,
    email: z.string().email({ message: "Email must be Valid Format" }),
    password: z.string().min(6, { message: "Password should have min 6 characters" })
})

export const signInValidation = z.object({
    identifier: z.string(),
    password: z.string()
})


export const verifyCode = z.object({
    code: z.string().length(6, { message: "Verification Code must be of exact 6 characters" })
})

export const acceptingMessageSchema = z.object({
    acceptMessages: z.boolean()
})

export const messageSchemaValidation = z.object({
    content: z.string()
        .min(10, { message: "Content must have atleast 10 characters" })
        .max(300, { message: "Content must not be above 300 characters" })
})

