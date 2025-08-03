import { db } from "@/lib/db";
import { comments } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";

export const getCommentsByVideoId = async (
  videoId: string,
  limit = 50,
  offset = 0
) => {
  return await db.query.comments.findMany({
    where: eq(comments.videoId, videoId),
    with: {
      user: true,
    },
    orderBy: [desc(comments.createdAt)],
    limit,
    offset,
  });
};

export const createComment = async ({
  content,
  videoId,
  userId,
}: {
  content: string;
  videoId: string;
  userId: string;
}) => {
  try {
    if (!content.trim()) {
      return { error: "Comment content is required" };
    }

    const newComment = await db
      .insert(comments)
      .values({
        content: content.trim(),
        videoId,
        userId,
      })
      .returning();

    return {
      success: true,
      comment: newComment[0],
    };
  } catch (error) {
    console.error("Create comment error:", error);
    return { error: "Failed to create comment" };
  }
};

export const deleteComment = async (commentId: string, userId: string) => {
  try {
    // Check if comment belongs to user
    const comment = await db.query.comments.findFirst({
      where: eq(comments.id, commentId),
    });

    if (!comment) {
      return { error: "Comment not found" };
    }

    if (comment.userId !== userId) {
      return { error: "Unauthorized to delete this comment" };
    }

    await db.delete(comments).where(eq(comments.id, commentId));

    return {
      success: true,
    };
  } catch (error) {
    console.error("Delete comment error:", error);
    return { error: "Failed to delete comment" };
  }
};
