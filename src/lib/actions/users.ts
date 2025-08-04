"use server";

import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { createUser as createUserInDb } from "@/lib/db/queries/users";
import { revalidatePath } from "next/cache";
import { getUserByEmail } from "../db/queries/users";
import { generateVerificationCode } from "../db/queries/email-verification";
import { sendVerificationEmail } from "../email";
import { signUpSchema } from "@/components/schemas/SignupSchema";

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
    const result = signUpSchema.safeParse({
      name,
      email,
      password,
      confirmPassword: password,
    });

    if (!result.success) {
      return { error: result.error.issues[0].message };
    }

    // Check if user already exists
    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      return { error: "User with this email already exists" };
    }

    const newUser = await createUserInDb({
      email,
      password,
      name,
    });

    // Generate verification code
    const verificationResult = await generateVerificationCode(email);

    if (!verificationResult.success) {
      return { error: "Failed to generate verification code" };
    }

    // Send verification email
    sendVerificationEmail(
      email,
      verificationResult.verificationCode,
      newUser.name
    );

    return {
      success: true,
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
      },
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
    const updateData: { name?: string; image?: string } = {};
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
