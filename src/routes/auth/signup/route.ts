import { Request, Response } from "express";
import db from "../../../db/connect";
import usersTable from "../../../db/schema/user/user";
import { and, eq, or } from "drizzle-orm";
import bcrypt from "bcryptjs";

export default async function SignupHandler(req: Request, res: Response) {
  const { username, email, password, reffer } = req.body;
  try {
    const isUserExists = await db
      .select({
        id: usersTable.id,
        email: usersTable.email,
        username: usersTable.username
      })
      .from(usersTable)
      .where(
        or(
          eq(usersTable.username, username),
          and(eq(usersTable.email, email), eq(usersTable.provider, "LOCAL"))
        )
      )
      .limit(1);

    // check for username & email
    if (isUserExists.length > 0) {
      const isItUsername = isUserExists[0].username === username ? true : false;
      if (isItUsername) {
        res.status(400).json({
          from: "Focus",
          error: "sorry, username is already taken."
        });
        return;
      } else {
        res.status(400).json({
          from: "Focus",
          error: "sorry, email is already exists."
        });
        return;
      }
    }

    //main
    const hashedPassword = bcrypt.hashSync(password, 7);
    const user = await db.insert(usersTable).values({
      username,
      email,
      password: hashedPassword,
      provider: "LOCAL"
    });
    res.status(200).json({ message: "success" });

    //Message MQ Job Goes here
    return;
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
}
