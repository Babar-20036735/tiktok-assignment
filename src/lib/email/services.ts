import { createTransporter, getFromEmail } from "./config";
import {
  createVerificationEmailTemplate,
  createWelcomeEmailTemplate,
} from "./templates";

export interface EmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

// Send verification email
export const sendVerificationEmail = async (
  to: string,
  code: string,
  userName: string
): Promise<EmailResult> => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: getFromEmail(),
      to: to,
      subject: "Verify Your Email Address - VideoPlatform",
      html: createVerificationEmailTemplate(code, userName),
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Verification email sent: %s", info.messageId);

    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (error) {
    console.error("Error sending verification email:", error);
    return {
      success: false,
      error: "Failed to send verification email",
    };
  }
};

// Send welcome email after verification
export const sendWelcomeEmail = async (
  to: string,
  userName: string
): Promise<EmailResult> => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: getFromEmail(),
      to: to,
      subject: "Welcome to VideoPlatform! 🎉",
      html: createWelcomeEmailTemplate(userName),
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Welcome email sent: %s", info.messageId);

    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (error) {
    console.error("Error sending welcome email:", error);
    return {
      success: false,
      error: "Failed to send welcome email",
    };
  }
};
