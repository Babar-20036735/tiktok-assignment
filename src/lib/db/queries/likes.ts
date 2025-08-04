import { db } from "@/lib/db";
import { likes, videos, users, comments } from "@/lib/db/schema";
import { and, eq, desc, sql } from "drizzle-orm";

export const getLikedVideosByUserId = async (userId: string) => {
  return await db
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
    })
    .from(videos)
    .innerJoin(
      likes,
      and(
        eq(videos.id, likes.videoId),
        eq(likes.userId, userId),
        eq(likes.type, "like")
      )
    )
    .innerJoin(users, eq(videos.userId, users.id))
    .orderBy(desc(videos.createdAt));
};
