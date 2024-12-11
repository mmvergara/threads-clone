import { generateID } from "~/utils/cuid.server";
import { db } from "../db/drizzle.server";
import { userFollowers, users } from "../db/schema";
import { and, eq, getTableColumns, sql } from "drizzle-orm";
const { passwordHash, ...userWithoutPasswordHash } = getTableColumns(users);

export const getUserById = async (id: string) => {
  const user = await db
    .select({
      ...userWithoutPasswordHash,
    })
    .from(users)
    .where(eq(users.id, id))
    .limit(1);
  return user[0];
};

export const getUserByEmail = async (email: string) => {
  const user = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);
  return user[0];
};

export const updateUserProfileData = async (
  userId: string,
  data: {
    displayName: string;
    bio: string;
  }
) => {
  await db
    .update(users)
    .set({
      displayName: data.displayName,
      bio: data.bio,
    })
    .where(eq(users.id, userId));
  return true;
};

export const updateUserProfileImage = async (
  userId: string,
  profileImageUrl: string
) => {
  await db.update(users).set({ profileImageUrl }).where(eq(users.id, userId));
  return true;
};

export const followUser = async (
  followerUserId: string,
  toFollowUserId: string
) => {
  const id = generateID();
  await db.transaction(async (tx) => {
    await tx.insert(userFollowers).values({
      id,
      followedUserId: toFollowUserId,
      followerUserId,
    });

    await tx
      .update(users)
      .set({ followers: sql`${users.followers} + 1` })
      .where(eq(users.id, toFollowUserId));
  });

  return true;
};

export const unfollowUser = async (
  followerUserId: string,
  toUnfollowUserId: string
) => {
  await db.transaction(async (tx) => {
    await tx
      .delete(userFollowers)
      .where(
        and(
          eq(userFollowers.followedUserId, toUnfollowUserId),
          eq(userFollowers.followerUserId, followerUserId)
        )
      );
    await tx
      .update(users)
      .set({ followers: sql`${users.followers} - 1` })
      .where(eq(users.id, toUnfollowUserId));
  });
  return true;
};

export const isFollowedByUser = async (
  currentUserId: string,
  userId: string
) => {
  const user = await db
    .select()
    .from(userFollowers)
    .where(
      and(
        eq(userFollowers.followedUserId, userId),
        eq(userFollowers.followerUserId, currentUserId)
      )
    )
    .limit(1);
  return user.length > 0;
};
