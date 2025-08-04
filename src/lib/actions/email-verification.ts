"use server";

import {
  generateVerificationCode,
  verifyEmailCode,
  isEmailVerified,
} from "@/lib/db/queries/email-verification";
import { getUserByEmail } from "@/lib/db/queries/users";
import {
  sendVerificationEmail as sendEmail,
  sendWelcomeEmail,
} from "@/lib/email";

export async function sendVerificationEmail(email: string) {
  try {
    // Check if user exists
    const user = await getUserByEmail(email);
    if (!user) {
      return { error: "User not found" };
    }

    // Check if already verified
    if (user.emailVerified === "true") {
      return { error: "Email is already verified" };
    }

    // Generate verification code
    const result = await generateVerificationCode(email);

    if (!result.success) {
      return result;
    }

    // Send verification email
    const emailResult = await sendEmail(
      email,
      result.verificationCode,
      user.name
    );

    if (!emailResult.success) {
      console.error("Failed to send email:", emailResult.error);
      // Still return success but log the email error
      console.log(`Verification code for ${email}: ${result.verificationCode}`);
    }

    return {
      success: true,
      message: "Verification code sent to your email",
    };
  } catch (error) {
    console.error("Send verification email error:", error);
    return { error: "Failed to send verification email" };
  }
}

export async function verifyEmail(email: string, code: string) {
  try {
    const result = await verifyEmailCode(email, code);

    if (!result.success || !result.user) {
      return result;
    }

    // Send welcome email after successful verification
    sendWelcomeEmail(email, result?.user?.name);

    return {
      success: true,
      message: "Email verified successfully",
      user: result.user,
    };
  } catch (error) {
    console.error("Verify email error:", error);
    return { error: "Failed to verify email" };
  }
}

export async function checkEmailVerification(email: string) {
  try {
    const isVerified = await isEmailVerified(email);
    return { success: true, isVerified };
  } catch (error) {
    console.error("Check email verification error:", error);
    return { error: "Failed to check email verification" };
  }
}
