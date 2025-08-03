"use server";

import { db } from "@/lib/db";
import { comments } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function createComment({
  content,
  videoId,
  userId,
  parentId,
}: {
  content: string;
  videoId: string;
  userId: string;
  parentId?: string;
}) {
  try {
    if (!content || !videoId || !userId) {
      return { error: "Content, video ID, and user ID are required" };
    }

    const newComment = await db
      .insert(comments)
      .values({
        content,
        videoId,
        userId,
        parentId,
      })
      .returning();

    revalidatePath(`/video/${videoId}`);

    return {
      success: true,
      comment: newComment[0],
    };
  } catch (error) {
    console.error("Create comment error:", error);
    return { error: "Internal server error" };
  }
}

export async function getCommentsByVideoId(
  videoId: string,
  limit = 50,
  offset = 0
) {
  try {
    const commentList = await db.query.comments.findMany({
      where: eq(comments.videoId, videoId),
      with: {
        user: true,
        replies: {
          with: {
            user: true,
          },
        },
      },
      orderBy: [desc(comments.createdAt)],
      limit,
      offset,
    });

    return {
      success: true,
      comments: commentList,
    };
  } catch (error) {
    console.error("Get comments error:", error);
    return { error: "Internal server error" };
  }
}

export async function updateComment({
  id,
  content,
  userId,
}: {
  id: string;
  content: string;
  userId: string;
}) {
  try {
    // Check if comment belongs to user
    const comment = await db.query.comments.findFirst({
      where: eq(comments.id, id),
    });

    if (!comment) {
      return { error: "Comment not found" };
    }

    if (comment.userId !== userId) {
      return { error: "Unauthorized to edit this comment" };
    }

    const updatedComment = await db
      .update(comments)
      .set({
        content,
        updatedAt: new Date(),
      })
      .where(eq(comments.id, id))
      .returning();

    revalidatePath(`/video/${comment.videoId}`);

    return {
      success: true,
      comment: updatedComment[0],
    };
  } catch (error) {
    console.error("Update comment error:", error);
    return { error: "Internal server error" };
  }
}

export async function deleteComment(id: string, userId: string) {
  try {
    // Check if comment belongs to user
    const comment = await db.query.comments.findFirst({
      where: eq(comments.id, id),
    });

    if (!comment) {
      return { error: "Comment not found" };
    }

    if (comment.userId !== userId) {
      return { error: "Unauthorized to delete this comment" };
    }

    await db.delete(comments).where(eq(comments.id, id));

    revalidatePath(`/video/${comment.videoId}`);

    return {
      success: true,
    };
  } catch (error) {
    console.error("Delete comment error:", error);
    return { error: "Internal server error" };
  }
}
