import { generateID } from "~/utils/cuid.server";
import { db } from "../db/drizzle.server";
import { eq, sql } from "drizzle-orm";
import { and } from "drizzle-orm";
import { threadLikes, threads } from "../db/schema";

export async function likeThread(threadId: string, userId: string) {
  const id = generateID();
  await db.transaction(async (tx) => {
    await tx.insert(threadLikes).values({
      id,
      threadId,
      userId,
    });
    await tx
      .update(threads)
      .set({ likes: sql`${threads.likes} + 1` })
      .where(eq(threads.id, threadId));
  });
  return true;
}

export async function unlikeThread(threadId: string, userId: string) {
  await db.transaction(async (tx) => {
    await tx
      .delete(threadLikes)
      .where(
        and(eq(threadLikes.threadId, threadId), eq(threadLikes.userId, userId))
      );
    await tx
      .update(threads)
      .set({ likes: sql`${threads.likes} - 1` })
      .where(eq(threads.id, threadId));
  });
  return true;
}

export async function hasUserLikedThread(threadId: string, userId: string) {
  const like = await db
    .select()
    .from(threadLikes)
    .where(
      and(eq(threadLikes.threadId, threadId), eq(threadLikes.userId, userId))
    )
    .limit(1);
  return like.length > 0;
}
