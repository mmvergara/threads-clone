import { sql } from "drizzle-orm";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

// User Table
export const users = sqliteTable("users", {
  id: integer("id").notNull().primaryKey(),
  handle: text("handle").unique().notNull(),
  email: text("email").unique().notNull(),
  passwordHash: text("password_hash").notNull(),
  displayName: text("display_name").notNull(),
  bio: text("bio").default("Wow, such empty!"),
  profileImageUrl: text("profile_image_url").default(
    "https://via.placeholder.com/300x300"
  ),
  followers: integer("followers").default(0),
  following: integer("following").default(0),
  isVerified: integer("is_verified", { mode: "boolean" }).default(false),
  createdAt: integer("created_at", { mode: "number" })
    .notNull()
    .default(sql`(unixepoch())`),
});
