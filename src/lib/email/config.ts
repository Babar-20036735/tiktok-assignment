import nodemailer from "nodemailer";

export interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

export const getEmailConfig = (): EmailConfig => {
  return {
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER || "",
      pass: process.env.SMTP_PASS || "",
    },
  };
};

export const createTransporter = () => {
  const config = getEmailConfig();

  if (!config.auth.user || !config.auth.pass) {
    throw new Error(
      "SMTP_USER and SMTP_PASS environment variables are required"
    );
  }

  return nodemailer.createTransport(config);
};

export const getFromEmail = (): string => {
  const user = process.env.SMTP_USER;
  if (!user) {
    throw new Error("SMTP_USER environment variable is required");
  }
  return `"TikTok Clone" <${user}>`;
};
