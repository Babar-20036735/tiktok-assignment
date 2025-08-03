"use server";

import { auth } from "@/auth";
import {
  getCommentsByVideoId,
  createComment,
  deleteComment,
} from "@/lib/db/queries/comments";
import { revalidatePath } from "next/cache";

export async function getCommentsAction(videoId: string) {
  try {
    // Validate videoId
    if (!videoId || typeof videoId !== "string") {
      return { success: false, message: "Invalid video ID" };
    }

    const comments = await getCommentsByVideoId(videoId);

    return {
      success: true,
      comments,
    };
  } catch (error) {
    console.error("Get comments action error:", error);
    return { success: false, message: "Failed to fetch comments" };
  }
}

export async function createCommentAction(videoId: string, content: string) {
  try {
    // Get user session
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, message: "Authentication required" };
    }

    // Validate inputs
    if (!videoId || typeof videoId !== "string") {
      return { success: false, message: "Invalid video ID" };
    }

    if (!content || typeof content !== "string") {
      return { success: false, message: "Comment content is required" };
    }

    // Call the database function
    const result = await createComment({
      content,
      videoId,
      userId: session.user.id,
    });

    if (result.error) {
      return { success: false, message: result.error };
    }

    // Revalidate relevant paths
    revalidatePath("/");

    return {
      success: true,
      message: "Comment created successfully",
      comment: result.comment,
    };
  } catch (error) {
    console.error("Create comment action error:", error);
    return { success: false, message: "Internal server error" };
  }
}

export async function deleteCommentAction(commentId: string) {
  try {
    // Get user session
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, message: "Authentication required" };
    }

    // Validate commentId
    if (!commentId || typeof commentId !== "string") {
      return { success: false, message: "Invalid comment ID" };
    }

    // Call the database function
    const result = await deleteComment(commentId, session.user.id);

    if (result.error) {
      return { success: false, message: result.error };
    }

    // Revalidate relevant paths
    revalidatePath("/");

    return {
      success: true,
      message: "Comment deleted successfully",
    };
  } catch (error) {
    console.error("Delete comment action error:", error);
    return { success: false, message: "Internal server error" };
  }
}
