import { db } from "./drizzle.server";
import { users } from "./schema.server";
import { eq } from "drizzle-orm";

export const getUserById = async (id: string) => {
  const user = await db.select().from(users).where(eq(users.id, id)).limit(1);
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
