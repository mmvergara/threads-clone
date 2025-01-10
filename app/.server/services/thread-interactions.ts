import { generateID } from "~/.server/utils/cuid";
import { db } from "../db/drizzle.server";
import { eq, sql , and } from "drizzle-orm";
import { threadLikes, threadReposts, threads } from "../db/schema";

export async function toggleLikeThread(threadId: string, userId: string) {
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
        id: generateID(),
        threadId,
        userId,
      });
      delta = 1;
    }

    await tx
      .update(threads)
      .set({ likes: sql`${threads.likes} + ${delta}` })
      .where(eq(threads.id, threadId));

    return { liked: !hasUserLiked };
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

export async function toggleRepostThread({
  threadId,
  currentUserId,
}: {
  threadId: string;
  currentUserId: string;
}) {
  return await db.transaction(async (tx) => {
    const hasUserReposted =
      (
        await db
          .select()
          .from(threadReposts)
          .where(
            and(
              eq(threadReposts.threadId, threadId),
              eq(threadReposts.repostingUserId, currentUserId)
            )
          )
          .limit(1)
      ).length > 0;

    let delta = 0;

    if (hasUserReposted) {
      await tx
        .delete(threadReposts)
        .where(
          and(
            eq(threadReposts.threadId, threadId),
            eq(threadReposts.repostingUserId, currentUserId)
          )
        );
      delta = -1;
    } else {
      await tx.insert(threadReposts).values({
        id: generateID(),
        threadId,
        repostingUserId: currentUserId,
      });
    }

    await tx
      .update(threads)
      .set({ reposts: sql`${threads.reposts} + ${delta}` })
      .where(eq(threads.id, threadId));
    return { reposted: !hasUserReposted };
  });
}
