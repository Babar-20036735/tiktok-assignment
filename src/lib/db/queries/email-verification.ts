import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function generateVerificationCode(email: string) {
  try {
    // Generate a 6-digit verification code
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    // Set expiration time (15 minutes from now)
    const verificationCodeExpires = new Date(Date.now() + 15 * 60 * 1000);

    const updatedUser = await db
      .update(users)
      .set({
        verificationCode,
        verificationCodeExpires,
        updatedAt: new Date(),
      })
      .where(eq(users.email, email))
      .returning();

    return {
      success: true,
      verificationCode,
      user: updatedUser[0],
    };
  } catch (error) {
    console.error("Generate verification code error:", error);
    return { error: "Failed to generate verification code" };
  }
}

export async function verifyEmailCode(email: string, code: string) {
  try {
    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (!user) {
      return { error: "User not found" };
    }

    if (!user.verificationCode || !user.verificationCodeExpires) {
      return { error: "No verification code found" };
    }

    // Check if code is expired
    if (new Date() > user.verificationCodeExpires) {
      return { error: "Verification code has expired" };
    }

    // Check if code matches
    if (user.verificationCode !== code) {
      return { error: "Invalid verification code" };
    }

    // Update user to verified
    const updatedUser = await db
      .update(users)
      .set({
        emailVerified: "true",
        verificationCode: null,
        verificationCodeExpires: null,
        updatedAt: new Date(),
      })
      .where(eq(users.email, email))
      .returning();

    return {
      success: true,
      user: updatedUser[0],
    };
  } catch (error) {
    console.error("Verify email code error:", error);
    return { error: "Failed to verify email code" };
  }
}

export async function isEmailVerified(email: string) {
  try {
    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    return user?.emailVerified === "true";
  } catch (error) {
    console.error("Check email verification error:", error);
    return false;
  }
}
