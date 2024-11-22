import { NextFunction, Request, Response } from "express";
import z from "zod";

export default async function SignupValidation(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { username, email, password, reffer } = req.body;
  const result = schema.safeParse({ username, email, password, reffer });

  if (!result.success) {
    const errors = result.error.issues.map((issue) => {
      return {
        field: issue.path[0],
        message: issue.message
      };
    });
    res.status(400).json(errors);
    return;
  } else {
    next();
  }
}

const schema = z.object({
  username: z
    .string({ message: "sorry, username must be a string." })
    .regex(/^[a-zA-Z0-9_]+$/, {
      message:
        "sorry, username can only contain letters, numbers, and underscores."
    })
    .min(3, { message: "sorry, Username must be at least 3 characters." })
    .max(35, { message: "sorry, Username cannot exceed 35 characters." }),
  email: z
    .string({ message: "sorry, email must be a string." })
    .email({ message: "please, enter a valid email address." }),
  password: z
    .string({ message: "sorry, password must be a string." })
    .min(8, { message: "sorry, password must be at least 8 characters." })
    .regex(/[0-9]/, { message: "password must contain at least one number." })
    .regex(/[^a-zA-Z0-9]/, {
      message: "Password must contain at least one special character."
    }),
  reffer: z
    .string({ message: "please, enter a string reffer." })
    .max(35, { message: "sorry, reffer cannot exceed 35 characters." })
    .regex(/^[a-zA-Z0-9_]+$/, {
      message:
        "sorry, reffer can only contain letters, numbers, and underscores."
    })
    .optional()
});
