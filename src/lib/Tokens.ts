import crypto from "crypto";
import jwt from "jsonwebtoken";
import "dotenv/config";
import ms from "ms";

export function generateRandomToken(length = 32) {
  return crypto.randomBytes(length).toString("hex");
}

export function generateJwtToken({
  payload,
  expiresIn
}: {
  payload: object;
  expiresIn: number;
}) {
  if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET is not defined");
  return jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn });
}

export function generateAccessTokenFromRefreshToken(refreshToken: string) {
  console.log(process.env.JWT_SECRET);
  if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET is not defined");
  try {
    const payload: any = jwt.verify(
      refreshToken,
      process.env.JWT_SECRET as string
    );
    const { iat, exp, ...rest } = payload;
    return jwt.sign(rest, process.env.JWT_SECRET as string, {
      expiresIn: ms("20s")
    });
  } catch (error) {
    console.log(error);
    return null;
  }
}
