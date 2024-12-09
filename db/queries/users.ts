import { eq, sql, or, desc } from "drizzle-orm";
import { db } from "../drizzle";
import { users, threads, likes, follows, notifications } from "../schema";

export const advancedQueries = {
  // Get a thread with its author and likes
  getThreadWithDetails: async (threadId: string) => {
    return await db
      .select({
        thread: threads,
        author: users,
        likeCount: sql<number>`count(${likes.userId})`.as("likeCount"),
      })
      .from(threads)
      .leftJoin(users, eq(threads.userId, users.id))
      .leftJoin(likes, eq(threads.id, likes.threadId))
      .where(eq(threads.id, threadId))
      .groupBy(threads.id);
  },

  // Get user feed with detailed information
  getUserFeedWithDetails: async (userId: string) => {
    // Get IDs of users the current user follows
    const followedUserIds = await db
      .select({ followedId: follows.followedId })
      .from(follows)
      .where(eq(follows.followerId, userId));

    const userIdsToInclude = [
      ...followedUserIds.map((f) => f.followedId),
      userId,
    ];

    return await db
      .select({
        thread: threads,
        author: users,
        likeCount: sql<number>`count(${likes.userId})`.as("likeCount"),
        replyCount: sql<number>`count(${threads.parentThreadId})`.as(
          "replyCount"
        ),
      })
      .from(threads)
      .leftJoin(users, eq(threads.userId, users.id))
      .leftJoin(likes, eq(threads.id, likes.threadId))
      .where(or(...userIdsToInclude?.map((id) => eq(threads.userId, id))))
      .groupBy(threads.id)
      .orderBy(desc(threads.createdAt))
      .limit(20);
  },

  // Search threads with author details
  searchThreadsWithAuthors: async (searchTerm: string) => {
    return await db
      .select({
        thread: threads,
        author: {
          id: users.id,
          username: users.username,
          displayName: users.displayName,
        },
      })
      .from(threads)
      .leftJoin(users, eq(threads.userId, users.id))
      .where(sql`${threads.content} LIKE ${`%${searchTerm}%`}`)
      .orderBy(desc(threads.createdAt))
      .limit(50);
  },

  // Get user profile with followers, following, and thread count
  getUserProfileWithStats: async (userId: string) => {
    // Followers count
    const followersCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(follows)
      .where(eq(follows.followedId, userId));

    // Following count
    const followingCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(follows)
      .where(eq(follows.followerId, userId));

    // User threads count
    const threadsCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(threads)
      .where(eq(threads.userId, userId));

    // User details
    const userDetails = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    return {
      user: userDetails[0],
      followersCount: followersCount[0].count,
      followingCount: followingCount[0].count,
      threadsCount: threadsCount[0].count,
    };
  },

  // Get notification with related actor and thread details
  getNotificationsWithDetails: async (userId: string) => {
    return await db
      .select({
        notification: notifications,
        actor: {
          id: users.id,
          username: users.username,
          displayName: users.displayName,
        },
        thread: threads,
      })
      .from(notifications)
      .leftJoin(users, eq(notifications.actorId, users.id))
      .leftJoin(threads, eq(notifications.threadId, threads.id))
      .where(eq(notifications.userId, userId))
      .orderBy(desc(notifications.createdAt))
      .limit(20);
  },
};
