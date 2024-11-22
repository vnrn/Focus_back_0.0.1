import { NextFunction, Request, Response } from "express";
import z from "zod";

export default async function LoginValidation(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { usernameOrEmail, password } = req.body;

  const LoginSchema = z.object({
    usernameOrEmail: z
      .string({ message: "sorry, username must be a string." })
      .min(1, {
        message: "please, enter your username or email."
      })
      .min(3, {
        message: "sorry, Username or Email must be at least 3 characters."
      })
      .max(30, { message: "sorry, Username cannot exceed 30 characters" }),
    password: z.string({ message: "please, enter your password" })
  });

  const result = await LoginSchema.safeParseAsync({
    usernameOrEmail,
    password
  });

  if (result.success) {
    // Validation succeeded, proceed to the next middleware
    next();
  } else {
    // Validation failed, return errors
    const formattedErrors = result.error.errors.map((err) => ({
      field: err.path[0],
      message: err.message
    }));
    res.status(400).json({
      from: "zod",
      errors: formattedErrors
    });
  }
}
