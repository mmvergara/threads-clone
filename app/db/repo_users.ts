import { newSnowflakeID } from "~/utils/snowflake.server";
import { db } from "./drizzle.server";
import { users } from "./schema.server";
import { eq } from "drizzle-orm";

type createUserParams = {
  email: string;
  handle: string;
  passwordHash: string;
};
export const createUser = async ({
  email,
  handle,
  passwordHash,
}: createUserParams) => {
  const id = newSnowflakeID();
  await db.insert(users).values({
    id,
    handle,
    email,
    passwordHash,
    displayName: handle,
    isVerified: false,
  });
  return id;
};

// isEmailTaken
export const isEmailTaken = async (email: string) => {
  const user = await db.select().from(users).where(eq(users.email, email));
  return user.length > 0;
};

// isHandleTaken
export const isHandleTaken = async (handle: string) => {
  const user = await db.select().from(users).where(eq(users.handle, handle));
  return user.length > 0;
};
