import { generateID } from "~/utils/cuid.server";
import { threads, users } from "../db/schema";
import { db } from "../db/drizzle.server";
import { desc, eq, getTableColumns, isNull, sql } from "drizzle-orm";

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
    })
    .from(threads)
    .innerJoin(users, eq(threads.userId, users.id))
    .where(eq(threads.userId, userId));
  return res;
};

// export const threads = sqliteTable("threads", {
//   id: text("id").notNull().primaryKey(),
//   userId: text("user_id")
//     .notNull()
//     .references(() => users.id),
//   content: text("content").notNull(),
//   imageUrls: text("image_urls", { mode: "json" }).notNull(),
//   parentThreadId: text("parent_thread_id").references(
//     (): AnySQLiteColumn => threads.id
//   ),
//   likes: integer("likes").notNull().default(0),
//   replies: integer("replies").notNull().default(0),
//   reposts: integer("reposts").notNull().default(0),
//   createdAt: integer("created_at", { mode: "number" })
//     .notNull()
//     .default(sql`(unixepoch())`),
// });
