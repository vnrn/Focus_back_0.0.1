import { NextFunction, Request, Response } from "express";
import db from "../../../db/connect";
import usersTable from "../../../db/schema/Focus/user/user";
import { eq } from "drizzle-orm";
import "dotenv/config";

export default async function VerifyAccountHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { token, success_route, fail_route } = req.params;
  if (!process.env.FRONT_BASE_URL)
    throw new Error("FRONT_BASE_URL is not defined");

  if (!success_route) {
    res.redirect(`${process.env.FRONT_BASE_URL}`);
  } else if (!fail_route) {
    res.redirect(`${process.env.FRONT_BASE_URL}`);
  }

  if (!token) {
    res.redirect(
      `${process.env.FRONT_BASE_URL}${fail_route}?error=verify+missing+token`
    );
  } else if (typeof token !== "string") {
    res.redirect(
      `${process.env.FRONT_BASE_URL}${fail_route}?error=verify+invalid+token`
    );
  } else if (token.length !== 32) {
    res.redirect(
      `${process.env.FRONT_BASE_URL}${fail_route}?error=verify+invalid+token`
    );
  }

  try {
    const user = await db
      .select({
        id: usersTable.id,
        verifiedAt: usersTable.verifiedAt,
        verifyToken: usersTable.verifyToken,
        verifyTokenExpiresAt: usersTable.verifyTokenExpiresAt
      })
      .from(usersTable)
      .where(eq(usersTable.verifyToken, token));

    if (user.length === 0) {
      res.redirect(
        `${process.env.FRONT_BASE_URL}${fail_route}?error=expired+link`
      );
    } else if (user[0].verifiedAt) {
      res.redirect(
        `${process.env.FRONT_BASE_URL}${fail_route}?error=account+already+verified`
      );
    } else if (user[0].verifyTokenExpiresAt! < new Date()) {
      res.redirect(
        `${process.env.FRONT_BASE_URL}${fail_route}?error=expired+token`
      );
    }

    //verify the account
    await db
      .update(usersTable)
      .set({
        verifiedAt: new Date(),
        verifyToken: null,
        verifyTokenExpiresAt: null
      })
      .where(eq(usersTable.id, user[0].id));

    res.redirect(`${process.env.FRONT_BASE_URL}${success_route}`);
  } catch (error) {
    console.log(error);
    res.redirect(
      `${process.env.FRONT_BASE_URL}${fail_route}?error=unexpected+error`
    );
  }
}

export async function ResendVerificationEmailHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  //need accesToken will complete it after i make the middleware today is 22/11/2024
  // const { }
}
