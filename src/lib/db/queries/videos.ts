import { db } from "@/lib/db";
import { comments, likes, videoViews, videos, users } from "@/lib/db/schema";
import { and, count, desc, eq, sql, lt } from "drizzle-orm";

export const getVideos = async ({
  limit = 20,
  cursor,
  userId,
}: {
  limit?: number;
  cursor?: Date;
  userId?: string;
}) => {
  try {
    // Build the base query with joins
    const baseQuery = db
      .select({
        // Video fields
        id: videos.id,
        title: videos.title,
        description: videos.description,
        url: videos.url,
        thumbnail: videos.thumbnail,
        userId: videos.userId,
        createdAt: videos.createdAt,
        updatedAt: videos.updatedAt,
        // User fields
        userName: users.name,
        userEmail: users.email,
        userImage: users.image,
        // Like counts using subqueries
        likeCount: sql<number>`(
          SELECT COUNT(*)::int 
          FROM ${likes} l 
          WHERE l.video_id = ${videos.id} AND l.type = 'like'
        )`,
        dislikeCount: sql<number>`(
          SELECT COUNT(*)::int 
          FROM ${likes} l 
          WHERE l.video_id = ${videos.id} AND l.type = 'dislike'
        )`,
        commentsCount: sql<number>`(
          SELECT COUNT(*)::int 
          FROM ${comments} c 
          WHERE c.video_id = ${videos.id}
        )`,
        // User like status (if userId provided)
        userLikeType: userId
          ? sql<"like" | "dislike" | null>`(
              SELECT l.type 
              FROM ${likes} l 
              WHERE l.video_id = ${videos.id} AND l.user_id = ${userId}
              LIMIT 1
            )`
          : sql<"like" | "dislike" | null>`NULL`,
      })
      .from(videos)
      .innerJoin(users, eq(videos.userId, users.id));

    // Add cursor-based pagination
    const query = cursor
      ? baseQuery.where(lt(videos.createdAt, cursor))
      : baseQuery;

    // Add limit and ordering
    const results = await query
      .orderBy(desc(videos.createdAt))
      .limit(limit + 1); // Get one extra to determine if there are more pages

    // Check if there are more pages
    const hasNextPage = results.length > limit;
    const videoResults = hasNextPage ? results.slice(0, limit) : results;

    // Transform results to match Video interface
    const transformedVideos = videoResults.map((video) => ({
      id: video.id,
      title: video.title,
      description: video.description,
      url: video.url,
      thumbnail: video.thumbnail,
      userId: video.userId,
      createdAt: video.createdAt,
      updatedAt: video.updatedAt,
      user: {
        id: video.userId,
        name: video.userName,
        email: video.userEmail,
        image: video.userImage,
      },
      userLike: video.userLikeType,
      likeCount: video.likeCount,
      dislikeCount: video.dislikeCount,
      commentCount: video.commentsCount,
    }));

    // Get cursor for next page
    const nextCursor = hasNextPage
      ? videoResults[videoResults.length - 1].createdAt
      : null;

    return {
      videos: transformedVideos,
      nextCursor,
      hasNextPage,
    };
  } catch (error) {
    console.error("Get videos query error:", error);
    return {
      videos: [],
      nextCursor: null,
      hasNextPage: false,
    };
  }
};

export const getVideoById = async (id: string) => {
  return await db.query.videos.findFirst({
    where: eq(videos.id, id),
    with: {
      user: true,
    },
  });
};

export const getVideosByUserId = async (
  userId: string,
  limit = 20,
  offset = 0
) => {
  return await db.query.videos.findMany({
    where: eq(videos.userId, userId),
    orderBy: [desc(videos.createdAt)],
    limit,
    offset,
  });
};

// View queries
export const getVideoViews = async (videoId: string) => {
  const result = await db
    .select({ count: count() })
    .from(videoViews)
    .where(eq(videoViews.videoId, videoId));

  return result[0]?.count || 0;
};

// Analytics queries
export const getVideoStats = async (videoId: string) => {
  const [likesResult, dislikesResult, viewsResult, commentsResult] =
    await Promise.all([
      db
        .select({ count: count() })
        .from(likes)
        .where(and(eq(likes.videoId, videoId), eq(likes.type, "like"))),
      db
        .select({ count: count() })
        .from(likes)
        .where(and(eq(likes.videoId, videoId), eq(likes.type, "dislike"))),
      db
        .select({ count: count() })
        .from(videoViews)
        .where(eq(videoViews.videoId, videoId)),
      db
        .select({ count: count() })
        .from(comments)
        .where(eq(comments.videoId, videoId)),
    ]);

  return {
    likes: likesResult[0]?.count || 0,
    dislikes: dislikesResult[0]?.count || 0,
    views: viewsResult[0]?.count || 0,
    comments: commentsResult[0]?.count || 0,
  };
};

// Search queries
export const searchVideos = async (query: string, limit = 20, offset = 0) => {
  return await db.query.videos.findMany({
    where: sql`${videos.title} ILIKE ${`%${query}%`} OR ${
      videos.description
    } ILIKE ${`%${query}%`}`,
    with: {
      user: true,
    },
    orderBy: [desc(videos.createdAt)],
    limit,
    offset,
  });
};

// Comment queries
export const getCommentsByVideoId = async (
  videoId: string,
  limit = 50,
  offset = 0
) => {
  return await db.query.comments.findMany({
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
};

// Like queries
export const getLikesByVideoId = async (videoId: string) => {
  const likesCount = await db
    .select({ count: count() })
    .from(likes)
    .where(and(eq(likes.videoId, videoId), eq(likes.type, "like")));

  const dislikesCount = await db
    .select({ count: count() })
    .from(likes)
    .where(and(eq(likes.videoId, videoId), eq(likes.type, "dislike")));

  return {
    likes: likesCount[0]?.count || 0,
    dislikes: dislikesCount[0]?.count || 0,
  };
};

export const getUserLikeByVideoId = async (videoId: string, userId: string) => {
  return await db.query.likes.findFirst({
    where: and(eq(likes.videoId, videoId), eq(likes.userId, userId)),
  });
};

// Like/Dislike actions
export const likeVideo = async (videoId: string, userId: string) => {
  try {
    // Check if video exists
    const video = await getVideoById(videoId);
    if (!video) {
      return { error: "Video not found" };
    }

    // Check if user already liked/disliked this video
    const existingLike = await getUserLikeByVideoId(videoId, userId);

    if (existingLike) {
      if (existingLike.type === "like") {
        // Remove like
        await db.delete(likes).where(eq(likes.id, existingLike.id));
        return { success: true, action: "removed", type: "like" };
      } else {
        // Change dislike to like
        await db
          .update(likes)
          .set({ type: "like" })
          .where(eq(likes.id, existingLike.id));
        return { success: true, action: "changed", type: "like" };
      }
    } else {
      // Create new like
      await db.insert(likes).values({
        videoId,
        userId,
        type: "like",
      });
      return { success: true, action: "added", type: "like" };
    }
  } catch (error) {
    console.error("Like video error:", error);
    return { error: "Failed to like video" };
  }
};

export const dislikeVideo = async (videoId: string, userId: string) => {
  try {
    // Check if video exists
    const video = await getVideoById(videoId);
    if (!video) {
      return { error: "Video not found" };
    }

    // Check if user already liked/disliked this video
    const existingLike = await getUserLikeByVideoId(videoId, userId);

    if (existingLike) {
      if (existingLike.type === "dislike") {
        // Remove dislike
        await db.delete(likes).where(eq(likes.id, existingLike.id));
        return { success: true, action: "removed", type: "dislike" };
      } else {
        // Change like to dislike
        await db
          .update(likes)
          .set({ type: "dislike" })
          .where(eq(likes.id, existingLike.id));
        return { success: true, action: "changed", type: "dislike" };
      }
    } else {
      // Create new dislike
      await db.insert(likes).values({
        videoId,
        userId,
        type: "dislike",
      });
      return { success: true, action: "added", type: "dislike" };
    }
  } catch (error) {
    console.error("Dislike video error:", error);
    return { error: "Failed to dislike video" };
  }
};
