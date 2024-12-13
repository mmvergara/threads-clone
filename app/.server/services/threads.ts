import { generateID } from "~/utils/cuid.server";
import { threadReposts, threads, users } from "../db/schema";
import { db } from "../db/drizzle.server";
import {
  and,
  desc,
  eq,
  getTableColumns,
  ilike,
  isNotNull,
  isNull,
  like,
  sql,
} from "drizzle-orm";

const { passwordHash, ...userWithoutPasswordHash } = getTableColumns(users);

type CreateThreadParams = {
  userId: string;
  content: string;
  imagesUrlJsonString: string;
  parentThreadId?: string;
};
export const createThread = async ({
  userId,
  content,
  imagesUrlJsonString,
  parentThreadId,
}: CreateThreadParams) => {
  const id = generateID();
  const res = await db
    .insert(threads)
    .values({
      id,
      userId,
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

export const deleteThread = async (threadId: string) => {
  await db.delete(threads).where(eq(threads.id, threadId));
};

export const getThreadById = async (threadId: string) => {
  const res = await db.select().from(threads).where(eq(threads.id, threadId));
  return res[0];
};

type GetThreadsWithUserParams = {
  limit?: number;
  skip?: number;
  userId: string;
};

export const getThreadsWithUser = async ({
  limit = 10,
  skip = 0,
  userId,
}: GetThreadsWithUserParams) => {
  const res = await db
    .select({
      thread: getTableColumns(threads),
      user: userWithoutPasswordHash,
      isLiked: sql<boolean>`EXISTS (SELECT 1 FROM thread_likes WHERE thread_id = ${threads.id} AND user_id = ${userId})`,
      isReposted: sql<boolean>`EXISTS (SELECT 1 FROM thread_reposts WHERE thread_id = ${threads.id} AND reposting_user_id = ${userId})`,
    })
    .from(threads)
    .innerJoin(users, eq(threads.userId, users.id))
    .orderBy(desc(threads.createdAt))
    .where(isNull(threads.parentThreadId))
    .limit(limit)
    .offset(skip);
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
    .where(eq(threads.userId, userId));
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
    .where(
      and(eq(threads.parentThreadId, userId), isNotNull(threads.parentThreadId))
    );
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
