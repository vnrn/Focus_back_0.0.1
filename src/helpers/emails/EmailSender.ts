import nodemailer from "nodemailer";
import "dotenv/config";
import fs from "fs";

interface EmailsParams {
  email: string;
  subject: string;
  template: string;
}

async function SendEmail({ email, subject, template }: EmailsParams) {
  if (!process.env.EMAIL || !process.env.EMAIL_PASSWORD) {
    throw new Error("EMAIL_USER or EMAIL_PASSWORD is not defined");
  }
  const transporter = nodemailer.createTransport({
    service: "gmail",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL as string,
      pass: process.env.EMAIL_PASSWORD as string
    }
  });

  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL as string,
      to: email,
      subject,
      bcc: process.env.EMAIL as string,
      html: template
    });
    console.log(info.envelope);
  } catch (error: any) {
    throw new Error(error);
  }
}

export default SendEmail;
