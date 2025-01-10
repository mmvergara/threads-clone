import { generateID } from "~/.server/utils/cuid";
import { db } from "../db/drizzle.server";
import { userFollowers, users } from "../db/schema";
import { and, eq, getTableColumns, sql } from "drizzle-orm";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
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

export const updateUserProfileData = async ({
  currentUserId,
  displayName,
  bio,
}: {
  currentUserId: string;
  displayName: string;
  bio: string;
}) => {
  await db
    .update(users)
    .set({
      displayName,
      bio,
    })
    .where(eq(users.id, currentUserId));
  return true;
};

export const updateUserProfileImage = async ({
  currentUserId,
  profileImageUrl,
}: {
  currentUserId: string;
  profileImageUrl: string;
}) => {
  await db
    .update(users)
    .set({ profileImageUrl })
    .where(eq(users.id, currentUserId));
  return true;
};

export const toggleFollowUser = async ({
  followerUserId,
  toFollowUserId,
}: {
  followerUserId: string;
  toFollowUserId: string;
}) => {
  const isFollowed = await isFollowedByUser(followerUserId, toFollowUserId);
  return await db.transaction(async (tx) => {
    let delta = 0;
    if (isFollowed) {
      await tx
        .delete(userFollowers)
        .where(
          and(
            eq(userFollowers.followedUserId, toFollowUserId),
            eq(userFollowers.followerUserId, followerUserId)
          )
        );
      delta = -1;
    } else {
      await tx.insert(userFollowers).values({
        id: generateID(),
        followedUserId: toFollowUserId,
        followerUserId,
      });
      delta = 1;
    }
    await tx
      .update(users)
      .set({ followers: sql`${users.followers} + ${delta}` })
      .where(eq(users.id, toFollowUserId));

    return { followed: !isFollowed };
  });
};

export const getFollowedUsers = async (userId: string): Promise<string[]> => {
  const res = await db
    .select({
      followedUserId: userFollowers.followedUserId,
    })
    .from(userFollowers)
    .where(eq(userFollowers.followerUserId, userId));

  return res.map((item) => item.followedUserId);
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
