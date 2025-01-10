import { generateID } from "~/.server/utils/cuid";
import { threadLikes, threadReposts, threads, users } from "../db/schema";
import { db } from "../db/drizzle.server";
import {
  and,
  desc,
  eq,
  getTableColumns,
  inArray,
  isNotNull,
  isNull,
  like,
  sql,
} from "drizzle-orm";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { passwordHash, ...userWithoutPasswordHash } = getTableColumns(users);

type CreateThreadParams = {
  currentUserId: string;
  content: string;
  imagesUrlJsonString: string;
  parentThreadId?: string;
};
export const createThread = async ({
  currentUserId,
  content,
  imagesUrlJsonString,
  parentThreadId,
}: CreateThreadParams) => {
  const res = await db
    .insert(threads)
    .values({
      id: generateID(),
      userId: currentUserId,
      content,
      imageUrls: imagesUrlJsonString,
      parentThreadId: parentThreadId || null,
    })
    .returning();

  // if parentThreadId is provided, increment the replies count of the parent thread
  if (parentThreadId) {
    await db
      .update(threads)
      .set({ replies: sql`${threads.replies} + 1` })
      .where(eq(threads.id, parentThreadId));
  }

  return res[0];
};

export const deleteThread = async ({
  threadId,
  currentUserId,
  parentThreadId,
}: {
  threadId: string;
  currentUserId: string;
  parentThreadId?: string;
}) => {
  await db.transaction(async (tx) => {
    await tx
      .delete(threads)
      .where(and(eq(threads.id, threadId), eq(threads.userId, currentUserId)));
    if (parentThreadId) {
      await tx
        .update(threads)
        .set({ replies: sql`${threads.replies} - 1` })
        .where(eq(threads.id, parentThreadId));
    }
  });
};

export const getThreadById = async (threadId: string) => {
  const res = await db.select().from(threads).where(eq(threads.id, threadId));
  return res[0];
};

export const getThreads = async ({
  currentUserId,
}: {
  currentUserId: string;
}) => {
  const res = await db
    .select({
      thread: getTableColumns(threads),
      user: userWithoutPasswordHash,
      isLiked: sql<boolean>`EXISTS (SELECT 1 FROM thread_likes WHERE thread_id = ${threads.id} AND user_id = ${currentUserId})`,
      isReposted: sql<boolean>`EXISTS (SELECT 1 FROM thread_reposts WHERE thread_id = ${threads.id} AND reposting_user_id = ${currentUserId})`,
    })
    .from(threads)
    .innerJoin(users, eq(threads.userId, users.id))
    .orderBy(desc(threads.createdAt))
    .where(isNull(threads.parentThreadId))
    .limit(15);
  return res;
};

export const getFollowedUsersThreads = async ({
  currentUserId,
  followedUserIds,
}: {
  currentUserId: string;
  followedUserIds: string[];
}) => {
  const res = await db
    .select({
      thread: getTableColumns(threads),
      user: userWithoutPasswordHash,
      isLiked: sql<boolean>`EXISTS (SELECT 1 FROM thread_likes WHERE thread_id = ${threads.id} AND user_id = ${currentUserId})`,
      isReposted: sql<boolean>`EXISTS (SELECT 1 FROM thread_reposts WHERE thread_id = ${threads.id} AND reposting_user_id = ${currentUserId})`,
    })
    .from(threads)
    .innerJoin(users, eq(threads.userId, users.id))
    .where(inArray(threads.userId, followedUserIds))
    .orderBy(desc(threads.createdAt))
    .limit(15);

  return res;
};

export const getUserThreads = async ({
  userId,
  currentUserId,
}: {
  userId: string;
  currentUserId: string;
}) => {
  const res = await db
    .select({
      thread: getTableColumns(threads),
      isLiked: sql<boolean>`EXISTS (SELECT 1 FROM thread_likes WHERE thread_id = ${threads.id} AND user_id = ${currentUserId})`,
      isReposted: sql<boolean>`EXISTS (SELECT 1 FROM thread_reposts WHERE thread_id = ${threads.id} AND reposting_user_id = ${currentUserId})`,
    })
    .from(threads)
    .innerJoin(users, eq(threads.userId, users.id))
    .orderBy(desc(threads.createdAt))
    .where(and(eq(threads.userId, userId), isNull(threads.parentThreadId)));
  return res;
};

export const getUserReposts = async ({ userId }: { userId: string }) => {
  const res = await db
    .select({
      thread: getTableColumns(threads),
    })
    .from(threads)
    .innerJoin(threadReposts, eq(threads.id, threadReposts.threadId))
    .where(eq(threadReposts.repostingUserId, userId));
  return res;
};

export const getUserReplyThreads = async ({
  userId,
  currentUserId,
}: {
  userId: string;
  currentUserId: string;
}) => {
  const res = await db
    .select({
      thread: getTableColumns(threads),
      isLiked: sql<boolean>`EXISTS (SELECT 1 FROM thread_likes WHERE thread_id = ${threads.id} AND user_id = ${currentUserId})`,
    })
    .from(threads)
    .where(and(isNotNull(threads.parentThreadId), eq(threads.userId, userId)));
  return res;
};

export const searchThreads = async ({
  currentUserId,
  searchQuery,
}: {
  currentUserId: string;
  searchQuery: string;
}) => {
  const res = await db
    .select({
      thread: getTableColumns(threads),
      user: userWithoutPasswordHash,
      isLiked: sql<boolean>`EXISTS (SELECT 1 FROM thread_likes WHERE thread_id = ${threads.id} AND user_id = ${currentUserId})`,
    })
    .from(threads)
    .innerJoin(users, eq(threads.userId, users.id))
    .where(like(sql`UPPER(${threads.content})`, `%${searchQuery}%`));
  return res;
};

type NestedThread = {
  id: string;
  createdAt: number;
  userId: string;
  content: string;
  imageUrls: unknown;
  likes: number;
  replies: number;
  reposts: number;
  childThreads: NestedThread[] | null;
};

export const getThreadWithNestedReplies = async (
  threadId: string,
  currentUserId?: string
) => {
  const fetchThreadsRecursively = async (
    parentId: string
  ): Promise<NestedThread[]> => {
    const childThreads = await db
      .select({
        id: threads.id,
        createdAt: threads.createdAt,
        userId: threads.userId,
        content: threads.content,
        imageUrls: threads.imageUrls,
        likes: threads.likes,
        parentThreadId: threads.parentThreadId,
        replies: threads.replies,
        reposts: threads.reposts,
        user: userWithoutPasswordHash,
        isLiked: sql<boolean>`CASE WHEN ${threadLikes.id} IS NOT NULL THEN 1 ELSE 0 END`,
        isReposted: sql<boolean>`CASE WHEN ${threadReposts.id} IS NOT NULL THEN 1 ELSE 0 END`,
        childThreads: sql<NestedThread[]>`null`, // Placeholder for nested threads
      })
      .from(threads)
      .leftJoin(users, eq(threads.userId, users.id))
      .leftJoin(
        threadLikes,
        and(
          eq(threadLikes.threadId, threads.id),
          currentUserId ? eq(threadLikes.userId, currentUserId) : sql`1=1`
        )
      )
      .leftJoin(
        threadReposts,
        and(
          eq(threadReposts.threadId, threads.id),
          currentUserId
            ? eq(threadReposts.repostingUserId, currentUserId)
            : sql`1=1`
        )
      )
      .where(eq(threads.parentThreadId, parentId));

    // Recursively fetch child threads for each thread
    for (const thread of childThreads) {
      thread.childThreads = await fetchThreadsRecursively(thread.id);
    }

    return childThreads;
  };

  // Fetch the main thread first
  const mainThread = await db
    .select({
      id: threads.id,
      createdAt: threads.createdAt,
      userId: threads.userId,
      content: threads.content,
      imageUrls: threads.imageUrls,
      likes: threads.likes,
      replies: threads.replies,
      reposts: threads.reposts,
      parentThreadId: threads.parentThreadId,
      user: { ...userWithoutPasswordHash },
      isLiked: sql<boolean>`CASE WHEN ${threadLikes.id} IS NOT NULL THEN 1 ELSE 0 END`,
      isReposted: sql<boolean>`CASE WHEN ${threadReposts.id} IS NOT NULL THEN 1 ELSE 0 END`,
      childThreads: sql<NestedThread[]>`null`, // Placeholder for nested threads
    })
    .from(threads)
    .leftJoin(users, eq(threads.userId, users.id))
    .leftJoin(
      threadLikes,
      and(
        eq(threadLikes.threadId, threads.id),
        currentUserId ? eq(threadLikes.userId, currentUserId) : sql`1=1`
      )
    )
    .leftJoin(
      threadReposts,
      and(
        eq(threadReposts.threadId, threads.id),
        currentUserId
          ? eq(threadReposts.repostingUserId, currentUserId)
          : sql`1=1`
      )
    )
    .where(eq(threads.id, threadId))
    .get();

  if (!mainThread) {
    return null;
  }

  // Fetch child threads recursively
  mainThread.childThreads = await fetchThreadsRecursively(threadId);

  return mainThread;
};
