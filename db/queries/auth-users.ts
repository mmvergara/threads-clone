import { eq, or, sql } from "drizzle-orm";
import { db } from "../drizzle";
import { users } from "../schema";
import bcrypt from "bcrypt";
import { z } from "zod";

// User input validation schemas
const userSchema = {
  register: z.object({
    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .max(20, "Username must be max 20 characters")
      .regex(
        /^[a-zA-Z0-9_]+$/,
        "Username can only contain letters, numbers, and underscores"
      ),
    email: z.string().email("Invalid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
        "Password must include letters, numbers, and special characters"
      ),
    displayName: z.string().optional(),
    bio: z.string().max(160, "Bio must be max 160 characters").optional(),
  }),

  login: z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
  }),

  updateProfile: z.object({
    displayName: z.string().optional(),
    bio: z.string().max(160, "Bio must be max 160 characters").optional(),
    profileImageUrl: z.string().url().optional(),
    coverImageUrl: z.string().url().optional(),
  }),
};

export const authQueries = {
  // Register a new user
  register: async (userData: z.infer<typeof userSchema.register>) => {
    // Validate input
    const validatedData = userSchema.register.parse(userData);

    // Check if username or email already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(
        or(
          eq(users.username, validatedData.username),
          eq(users.email, validatedData.email)
        )
      );

    if (existingUser) {
      throw new Error("Username or email already exists");
    }

    // Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(validatedData.password, saltRounds);

    // Insert new user
    const [newUser] = await db
      .insert(users)
      .values({
        id: crypto.randomUUID(),
        username: validatedData.username,
        email: validatedData.email,
        passwordHash,
        displayName: validatedData.displayName,
        bio: validatedData.bio,
        createdAt: Math.floor(Date.now() / 1000),
      })
      .returning();

    return newUser;
  },

  // User login
  login: async (loginData: z.infer<typeof userSchema.login>) => {
    // Validate input
    const validatedData = userSchema.login.parse(loginData);

    // Find user by email
    const user = await db
      .select()
      .from(users)
      .where(eq(users.email, validatedData.email))
      .limit(1);

    if (user.length === 0) {
      throw new Error("Invalid email or password");
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(
      validatedData.password,
      user[0].passwordHash
    );

    if (!isPasswordValid) {
      throw new Error("Invalid email or password");
    }

    return user;
  },

  // Update user profile
  updateProfile: async (
    userId: string,
    updateData: z.infer<typeof userSchema.updateProfile>
  ) => {
    // Validate input
    const validatedData = userSchema.updateProfile.parse(updateData);

    // Update user profile
    const [updatedUser] = await db
      .update(users)
      .set(validatedData)
      .where(eq(users.id, userId))
      .returning();

    return updatedUser;
  },

  // Check username availability
  checkUsernameAvailability: async (username: string) => {
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.username, username))
      .limit(1);

    return {
      available: !existingUser,
      message: existingUser
        ? "Username is already taken"
        : "Username is available",
    };
  },

  // Change password
  changePassword: async (
    userId: string,
    currentPassword: string,
    newPassword: string
  ) => {
    // Validate new password
    z.string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
        "Password must include letters, numbers, and special characters"
      )
      .parse(newPassword);

    // Find user
    const user = await db.select().from(users).where(eq(users.id, userId));

    if (user.length === 0) {
      throw new Error("User not found");
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(
      currentPassword,
      user[0].passwordHash
    );

    if (!isCurrentPasswordValid) {
      throw new Error("Current password is incorrect");
    }

    // Hash new password
    const saltRounds = 10;
    const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);

    // Update password
    await db
      .update(users)
      .set({ passwordHash: newPasswordHash })
      .where(eq(users.id, userId));

    return { message: "Password updated successfully" };
  },

  // Get user search suggestions
  searchUsers: async (query: string, limit: number = 10) => {
    return await db
      .select({
        id: users.id,
        username: users.username,
        displayName: users.displayName,
        profileImageUrl: users.profileImageUrl,
      })
      .from(users)
      .where(
        or(
          sql`${users.username} LIKE ${`%${query}%`}`,
          sql`${users.displayName} LIKE ${`%${query}%`}`
        )
      )
      .limit(limit);
  },

  // Verify user account (e.g., email verification)
  verifyAccount: async (userId: string) => {
    const [updatedUser] = await db
      .update(users)
      .set({ isVerified: true })
      .where(eq(users.id, userId))
      .returning();

    return updatedUser;
  },
};

// Example usage with error handling
async function exampleAuthFlow() {
  try {
    // Register a new user
    const newUser = await authQueries.register({
      username: "johndoe",
      email: "john@example.com",
      password: "SecurePass123!",
      displayName: "John Doe",
    });

    // Check username availability
    const usernameCheck = await authQueries.checkUsernameAvailability(
      "newusername"
    );

    // Login
    const loggedInUser = await authQueries.login({
      email: "john@example.com",
      password: "SecurePass123!",
    });

    // Update profile
    const updatedProfile = await authQueries.updateProfile(newUser.id, {
      displayName: "John D.",
      bio: "Software developer",
    });

    // Change password
    await authQueries.changePassword(
      newUser.id,
      "SecurePass123!",
      "NewSecurePass456!"
    );
  } catch (error) {
    console.error("Authentication error:", error);
  }
}
