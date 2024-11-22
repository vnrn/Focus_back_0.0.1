import Bull, { Job, Queue } from "bull";
import Redis from "ioredis";
import "dotenv/config";
import db from "../db/connect";
import settingsTable from "../db/schema/Focus/user/settings";
import profilesTable from "../db/schema/Focus/user/profiles";
import trailsTable from "../db/schema/Focus/payment/trails";
import { userSignupSourcesTable } from "../db/schema";
import SendEmail from "../helpers/emails/EmailSender";

interface SignupJob {
  payload: {
    userId: string;
    email?: string | null;
    verifyToken?: string;
    reffer?: string;
    provider: "GOOGLE" | "GITHUB" | "LOCAL";
  };
}

const SignupQueue = new Bull<SignupJob>(
  "signup-queue",
  `${process.env.REDIS_URL}/1`
);

SignupQueue.process(async (job, done) => {
  console.log(job.data);
  const { userId, email, provider, verifyToken, reffer }: any =
    job.data.payload;
  if (!userId || typeof userId !== "string")
    throw new Error("userId is required");
  try {
    await db.transaction(async (tx) => {
      await tx.insert(settingsTable).values({
        userId: userId
      });
      await tx.insert(profilesTable).values({
        userId: userId
      });
      await tx.insert(trailsTable).values({
        userId: userId,
        startedAt: new Date()
      });

      if (reffer && typeof reffer === "string") {
        console.log(reffer);
        await tx.insert(userSignupSourcesTable).values({
          userId: userId,
          source: reffer
        });
      }
    });

    if (provider === "LOCAL") {
      if (!verifyToken && typeof verifyToken !== "string") {
        throw new Error("verify token is required when provider is LOCAL");
      } else if (!email && typeof email !== "string") {
        throw new Error("email is required when provider is LOCAL");
      } else if (!process.env.BASE_URL) {
        throw new Error("BASE_URL is not defined in env");
      }

      await SendEmail({
        email: email,
        subject: "Account Verification",
        template:
          `<a href='${process.env.BASE_URL as string}/verify/` +
          verifyToken +
          "'>Verify Account</a>"
      });
    }

    done();
  } catch (error: any) {
    throw new Error(error);
  }
});

export default SignupQueue;
