import { generateID } from "~/utils/cuid.server";
import { db } from "../db/drizzle.server";
import { eq, sql } from "drizzle-orm";
import { and } from "drizzle-orm";
import { threadLikes, threadReposts, threads } from "../db/schema";

export async function toggleLikeThread(threadId: string, userId: string) {
  const id = generateID();
  const hasUserLiked = await hasUserLikedThread(threadId, userId);

  return await db.transaction(async (tx) => {
    let delta = 0;
    if (hasUserLiked) {
      await tx
        .delete(threadLikes)
        .where(
          and(
            eq(threadLikes.threadId, threadId),
            eq(threadLikes.userId, userId)
          )
        );
      delta = -1;
    } else {
      await tx.insert(threadLikes).values({
        id,
        threadId,
        userId,
      });
      delta = 1;
    }

    await tx
      .update(threads)
      .set({ likes: sql`${threads.likes} + ${delta}` })
      .where(eq(threads.id, threadId));

    return true;
  });
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

export async function repostThread(threadId: string, userId: string) {
  await db.transaction(async (tx) => {
    const id = generateID();
    await tx.insert(threadReposts).values({
      id,
      threadId,
      repostingUserId: userId,
    });
    await tx
      .update(threads)
      .set({ reposts: sql`${threads.reposts} + 1` })
      .where(eq(threads.id, threadId));
  });
  return true;
}

export async function unrepostThread(threadId: string, userId: string) {
  await db.transaction(async (tx) => {
    await tx
      .delete(threadReposts)
      .where(
        and(
          eq(threadReposts.threadId, threadId),
          eq(threadReposts.repostingUserId, userId)
        )
      );
    await tx
      .update(threads)
      .set({ reposts: sql`${threads.reposts} - 1` })
      .where(eq(threads.id, threadId));
  });
  return true;
}

export async function hasUserRepostedThread(threadId: string, userId: string) {
  const repost = await db
    .select()
    .from(threadReposts)
    .where(
      and(
        eq(threadReposts.threadId, threadId),
        eq(threadReposts.repostingUserId, userId)
      )
    )
    .limit(1);
  return repost.length > 0;
}
