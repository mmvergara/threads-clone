import { relations, sql } from "drizzle-orm";
import {
  sqliteTable,
  text,
  integer,
  primaryKey,
  AnySQLiteColumn,
} from "drizzle-orm/sqlite-core";

// User Table
export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  username: text("username").unique().notNull(),
  email: text("email").unique().notNull(),
  passwordHash: text("password_hash").notNull(),
  displayName: text("display_name"),
  bio: text("bio"),
  profileImageUrl: text("profile_image_url"),
  coverImageUrl: text("cover_image_url"),
  followers: integer("followers").default(0),
  following: integer("following").default(0),
  isVerified: integer("is_verified", { mode: "boolean" }).default(false),
  createdAt: integer("created_at", { mode: "number" })
    .notNull()
    .default(sql`(unixepoch())`),
});

// Thread (Post) Table
export const threads = sqliteTable("threads", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  content: text("content"),
  imageUrls: text("image_urls"),
  parentThreadId: text("parent_thread_id").references(
    (): AnySQLiteColumn => threads.id,
    {
      onDelete: "cascade",
    }
  ),
  isReply: integer("is_reply", { mode: "boolean" }).default(false),
  likes: integer("likes").default(0).notNull(),
  reposts: integer("reposts").default(0).notNull(),
  replies: integer("replies").default(0).notNull(),
  createdAt: integer("created_at", { mode: "number" })
    .notNull()
    .default(sql`(unixepoch())`),
});

// Likes Table
export const likes = sqliteTable(
  "likes",
  {
    userId: text("user_id").references(() => users.id, { onDelete: "cascade" }),
    threadId: text("thread_id").references(() => threads.id, {
      onDelete: "cascade",
    }),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.userId, table.threadId] }),
  })
);

// Follows Table
export const follows = sqliteTable(
  "follows",
  {
    followerId: text("follower_id")
      .references(() => users.id, {
        onDelete: "cascade",
      })
      .notNull(),
    followedId: text("followed_id")
      .references(() => users.id, {
        onDelete: "cascade",
      })
      .notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.followerId, table.followedId] }),
  })
);

// Notifications Table
export const notifications = sqliteTable("notifications", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  actorId: text("actor_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  type: text("type", {
    enum: ["like", "reply", "repost", "follow"],
  }).notNull(),
  threadId: text("thread_id").references(() => threads.id, {
    onDelete: "set null",
  }),
  isRead: integer("is_read", { mode: "boolean" }).notNull().default(false),
  createdAt: integer("created_at", { mode: "number" })
    .notNull()
    .default(sql`(unixepoch())`),
});

// Relation Definitions
export const usersRelations = relations(users, ({ many }) => ({
  threads: many(threads),
  likes: many(likes),
  followers: many(follows, { relationName: "follower" }),
  following: many(follows, { relationName: "followed" }),
  notifications: many(notifications),
}));

export const threadsRelations = relations(threads, ({ one, many }) => ({
  author: one(users, {
    fields: [threads.userId],
    references: [users.id],
  }),
  parentThread: one(threads, {
    fields: [threads.parentThreadId],
    references: [threads.id],
  }),
  likes: many(likes),
  replies: many(threads, { relationName: "thread_replies" }),
}));

export const likesRelations = relations(likes, ({ one }) => ({
  user: one(users, {
    fields: [likes.userId],
    references: [users.id],
  }),
  thread: one(threads, {
    fields: [likes.threadId],
    references: [threads.id],
  }),
}));

export const followsRelations = relations(follows, ({ one }) => ({
  follower: one(users, {
    fields: [follows.followerId],
    references: [users.id],
    relationName: "follower",
  }),
  followed: one(users, {
    fields: [follows.followedId],
    references: [users.id],
    relationName: "followed",
  }),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id],
  }),
  actor: one(users, {
    fields: [notifications.actorId],
    references: [users.id],
  }),
  thread: one(threads, {
    fields: [notifications.threadId],
    references: [threads.id],
  }),
}));
