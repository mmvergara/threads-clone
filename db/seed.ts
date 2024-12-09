import { faker } from "@faker-js/faker";
import { users, threads, likes, follows, notifications } from "./schema";
import { db } from "./drizzle";

// Helper function to generate a unique ID
function generateId(): string {
  return crypto.randomUUID();
}

async function seedDatabase() {
  // Clear existing data (optional, be careful in production)
  await db.delete(notifications);
  await db.delete(likes);
  await db.delete(follows);
  await db.delete(threads);
  await db.delete(users);

  // Create Users
  const userIds: string[] = [];
  const userInserts = Array.from({ length: 10 }).map(() => {
    const id = generateId();
    userIds.push(id);
    return {
      id,
      username: faker.internet.username(),
      email: faker.internet.email(),
      passwordHash: "hashed_password_placeholder", // In real app, use proper hashing
      displayName: faker.person.fullName(),
      bio: faker.person.bio(),
      profileImageUrl: faker.image.avatar(),
      coverImageUrl: faker.image.url(),
      isVerified: Math.random() > 0.8, // 20% chance of being verified
      createdAt: Math.floor(Date.now() / 1000),
    };
  });
  await db.insert(users).values(userInserts);

  // Create Threads
  const threadIds: string[] = [];
  const threadInserts = userIds.flatMap((userId) =>
    Array.from({ length: faker.number.int({ min: 1, max: 5 }) }).map(() => {
      const id = generateId();
      threadIds.push(id);
      return {
        id,
        userId,
        content: faker.lorem.paragraph(),
        imageUrls: Math.random() > 0.7 ? faker.image.url() : null,
        likes: faker.number.int({ min: 0, max: 100 }),
        reposts: faker.number.int({ min: 0, max: 50 }),
        replies: faker.number.int({ min: 0, max: 30 }),
        createdAt: Math.floor(Date.now() / 1000),
      };
    })
  );
  await db.insert(threads).values(threadInserts);

  // Create Likes
  const likeInserts = threadIds.flatMap((threadId) =>
    userIds
      .sort(() => 0.5 - Math.random()) // Randomize
      .slice(0, faker.number.int({ min: 1, max: 5 })) // Random number of likes
      .map((userId) => ({ userId, threadId }))
  );
  await db.insert(likes).values(likeInserts);

  // Create Follows
  const followInserts = userIds.flatMap((followerId) =>
    userIds
      .filter((followedId) => followedId !== followerId)
      .sort(() => 0.5 - Math.random())
      .slice(0, faker.number.int({ min: 1, max: 3 })) // Random number of follows
      .map((followedId) => ({ followerId, followedId }))
  );
  await db.insert(follows).values(followInserts);

  console.log("Database seeded successfully!");
}

// Run the seeding function
seedDatabase().catch(console.error);
