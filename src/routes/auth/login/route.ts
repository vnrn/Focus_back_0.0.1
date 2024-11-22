import { NextFunction, Request, Response } from "express";
import db from "../../../db/connect";
import usersTable from "../../../db/schema/Focus/user/user";
import { and, eq, or } from "drizzle-orm";
import bcrypt from "bcryptjs";
import {
  generateAccessTokenFromRefreshToken,
  generateJwtToken
} from "../../../lib/Tokens";
import ms from "ms";

export default async function LoginHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { usernameOrEmail, password } = req.body;
  try {
    const user = await db
      .select()
      .from(usersTable)
      .where(
        and(
          or(
            eq(usersTable.username, usernameOrEmail),
            eq(usersTable.email, usernameOrEmail)
          ),
          eq(usersTable.provider, "LOCAL")
        )
      )
      .limit(1);

    if (user.length === 0) {
      const isFoundByEmail = usernameOrEmail.includes("@") ? true : false;
      res.status(404).json({
        from: "Focus",
        errors: [
          {
            field: "usernameOrEmail",
            message: `sorry, we couldn't find an account with that ${
              isFoundByEmail ? "email address" : "username"
            }.`
          }
        ]
      });
      return;
    }

    const isPasswordCorrect = await bcrypt.compare(password, user[0].password!);

    if (!isPasswordCorrect) {
      res.status(401).json({
        from: "Focus",
        errors: [
          {
            field: "password",
            message: "sorry, your password is incorrect."
          }
        ]
      });
      return;
    }

    await db
      .update(usersTable)
      .set({ lastLogin: new Date() })
      .where(eq(usersTable.id, user[0].id));

    //generate tokens (refresh & access)
    const refToken = generateJwtToken({
      payload: { userId: user[0].id, provider: user[0].provider },
      expiresIn: ms("120 days")
    });
    const accessToken = generateAccessTokenFromRefreshToken(refToken);

    res.status(200);
    res.cookie("refreshToken", refToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: ms("120 days")
    });
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: ms("20s")
    });
    res.json({
      from: "Focus",
      data: {
        refreshToken: refToken,
        accessToken
      }
    });
    return;
  } catch (error: any) {
    next(error);
    throw new Error(error);
  }
}
