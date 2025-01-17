import { sql } from "drizzle-orm";
import {
  sqliteTable,
  text,
  integer,
  AnySQLiteColumn,
  uniqueIndex,
  index,
} from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: text("id").notNull().primaryKey(),
  handle: text("handle", { length: 30 }).unique().notNull(),
  email: text("email", { length: 254 }).unique().notNull(),
  passwordHash: text("password_hash").notNull(),
  displayName: text("display_name", { length: 30 }).notNull(),
  bio: text("bio", { length: 254 }).notNull().default("Wow, such empty!"),
  profileImageUrl: text("profile_image_url")
    .notNull()
    .default("https://robohash.org/threads"),
  followers: integer("followers").notNull().default(0),
  following: integer("following").notNull().default(0),
  isVerified: integer("is_verified", { mode: "boolean" })
    .notNull()
    .default(false),
  createdAt: integer("created_at", { mode: "number" })
    .notNull()
    .default(sql`(strftime('%s', 'now'))`),
});

export const threads = sqliteTable("threads", {
  id: text("id").notNull().primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, {
      onDelete: "cascade",
    }),
  content: text("content", { length: 600 }).notNull(),
  imageUrls: text("image_urls", { mode: "json" }).notNull(),
  parentThreadId: text("parent_thread_id").references(
    (): AnySQLiteColumn => threads.id,
    {
      onDelete: "cascade",
    }
  ),
  likes: integer("likes").notNull().default(0),
  replies: integer("replies").notNull().default(0),
  reposts: integer("reposts").notNull().default(0),
  createdAt: integer("created_at", { mode: "number" })
    .notNull()
    .default(sql`(strftime('%s', 'now'))`),
});

export const threadLikes = sqliteTable(
  "thread_likes",
  {
    id: text("id").notNull().primaryKey(),
    threadId: text("thread_id")
      .notNull()
      .references(() => threads.id, {
        onDelete: "cascade",
      }),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, {
        onDelete: "cascade",
      }),
    createdAt: integer("created_at", { mode: "number" })
      .notNull()
      .default(sql`(strftime('%s', 'now'))`),
  },
  (table) => {
    return {
      uniqueLike: uniqueIndex("unique_like_idx").on(
        table.threadId,
        table.userId
      ),
    };
  }
);

export const threadReposts = sqliteTable(
  "thread_reposts",
  {
    id: text("id").notNull().primaryKey(),
    threadId: text("thread_id")
      .notNull()
      .references(() => threads.id, {
        onDelete: "cascade",
      }),
    repostingUserId: text("reposting_user_id")
      .notNull()
      .references(() => users.id, {
        onDelete: "cascade",
      }),
    createdAt: integer("created_at", { mode: "number" })
      .notNull()
      .default(sql`(strftime('%s', 'now'))`),
  },
  (table) => {
    return {
      uniqueRepost: uniqueIndex("unique_repost_idx").on(
        table.threadId,
        table.repostingUserId
      ),
    };
  }
);

export const userFollowers = sqliteTable(
  "user_followers",
  {
    id: text("id").notNull().primaryKey(),
    followedUserId: text("followed_user_id")
      .notNull()
      .references(() => users.id, {
        onDelete: "cascade",
      }),
    followerUserId: text("follower_user_id")
      .notNull()
      .references(() => users.id, {
        onDelete: "cascade",
      }),
    createdAt: integer("created_at", { mode: "number" })
      .notNull()
      .default(sql`(strftime('%s', 'now'))`),
  },
  (table) => {
    return {
      uniqueFollow: uniqueIndex("unique_follow_idx").on(
        table.followedUserId,
        table.followerUserId
      ),
      noSelfFollow: index("no_self_follow_idx").on(
        table.followedUserId,
        table.followerUserId
      ),
    };
  }
);

export type User = Omit<typeof users.$inferSelect, "passwordHash">;
export type Thread = typeof threads.$inferSelect;
