import { db } from "../db/drizzle.server";
import { users } from "../db/schema";
import { eq, getTableColumns } from "drizzle-orm";
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
