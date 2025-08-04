"use server";

import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { hashPassword } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { getUserByEmail } from "../db/queries/users";
import { generateVerificationCode } from "../db/queries/email-verification";
import { sendVerificationEmail } from "../email";

export async function createUser({
  email,
  password,
  name,
}: {
  email: string;
  password: string;
  name: string;
}) {
  try {
    // Validate input
    if (!email || !password || !name) {
      return { error: "Email, password, and name are required" };
    }

    if (password.length < 6) {
      return { error: "Password must be at least 6 characters long" };
    }

    // Check if user already exists
    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      return { error: "User with this email already exists" };
    }

    // Hash password and create user
    const hashedPassword = await hashPassword(password);

    const newUser = await db
      .insert(users)
      .values({
        email,
        password: hashedPassword,
        name,
        emailVerified: "false",
      })
      .returning();

    // Generate verification code
    const verificationResult = await generateVerificationCode(email);

    if (!verificationResult.success) {
      return { error: "Failed to generate verification code" };
    }

    // Send verification email
    const emailResult = await sendVerificationEmail(
      email,
      verificationResult.verificationCode,
      newUser[0].name
    );

    if (!emailResult.success) {
      console.error("Failed to send verification email:", emailResult.error);
      // Still log the code for testing if email fails
      console.log(
        `Verification code for ${email}: ${verificationResult.verificationCode}`
      );
    }

    return {
      success: true,
      user: {
        id: newUser[0].id,
        email: newUser[0].email,
        name: newUser[0].name,
      },
      // Remove this in production - only for testing
      verificationCode: verificationResult.verificationCode,
    };
  } catch (error) {
    console.error("Create user error:", error);
    return { error: "Internal server error" };
  }
}

export async function getUserById(id: string) {
  try {
    const user = await db.query.users.findFirst({
      where: eq(users.id, id),
    });

    if (!user) {
      return { error: "User not found" };
    }

    return { success: true, user };
  } catch (error) {
    console.error("Get user error:", error);
    return { error: "Internal server error" };
  }
}

export async function updateUser({
  id,
  name,
  image,
}: {
  id: string;
  name?: string;
  image?: string;
}) {
  try {
    const updateData: any = {};
    if (name) updateData.name = name;
    if (image) updateData.image = image;

    const updatedUser = await db
      .update(users)
      .set({
        ...updateData,
        updatedAt: new Date(),
      })
      .where(eq(users.id, id))
      .returning();

    if (updatedUser.length === 0) {
      return { error: "User not found" };
    }

    revalidatePath("/profile");

    return {
      success: true,
      user: updatedUser[0],
    };
  } catch (error) {
    console.error("Update user error:", error);
    return { error: "Internal server error" };
  }
}
