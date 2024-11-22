import { Request, Response } from "express";
import db from "../../../db/connect";
import usersTable from "../../../db/schema/Focus/user/user";
import { and, eq, or } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { generateRandomToken } from "../../../lib/Tokens";
import SignupQueue from "../../../Queues/SignupQueue";

export default async function SignupHandler(req: Request, res: Response) {
  const {
    username,
    email,
    password,
    reffer: Reffer
  }: {
    username: string;
    email: string;
    password: string;
    reffer?: string;
  } = req.body;
  const IPP = req.headers["x-forwarded-for"] || req.socket.remoteAddress || "";
  const IP = IPP ? IPP.toString() : "NULL";
  const reffer = Reffer ? Reffer.toString() : "";
  try {
    const isUserExists = await db
      .select()
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
          errors: [
            {
              field: "username",
              message: "sorry, username is already taken."
            }
          ]
        });
        return;
      } else {
        res.status(400).json({
          from: "Focus",
          errors: [
            {
              field: "email",
              message: "sorry, email is already exists."
            }
          ]
        });
        return;
      }
    }

    //main
    const hashedPassword = bcrypt.hashSync(password, 7);
    const verifyToken = generateRandomToken();
    const user = await db
      .insert(usersTable)
      .values({
        username,
        email,
        password: hashedPassword,
        provider: "LOCAL",
        verifyToken: verifyToken,
        verifyTokenExpiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
        IP: IP
      })
      .returning({
        id: usersTable.id,
        email: usersTable.email
      });

    //queue
    await SignupQueue.add({
      payload: {
        userId: user[0].id,
        email: user[0].email ? user[0].email : null,
        verifyToken: verifyToken,
        reffer: reffer,
        provider: "LOCAL"
      }
    })
      .then(() => {
        console.log("signup job added to queue");
      })
      .catch((error) => {
        console.log(error);
        throw new Error(error);
      });
    res.status(200).json({ message: "success" });
    return;
  } catch (error: any) {
    throw new Error(error);
    res.status(500).json({ error });
  }
}
