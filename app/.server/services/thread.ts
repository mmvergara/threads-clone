import { generateID } from "~/utils/cuid.server";
import { threads } from "../db/schema.server";
import { db } from "../db/drizzle.server";

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
  await db.insert(threads).values({
    id,
    userId,
    content,
    imageUrls: imagesUrlJsonString,
    parentThreadId: parentThreadId || null,
  });
  return id;
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
