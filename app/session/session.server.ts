import { createCookieSessionStorage, redirect } from "@remix-run/node";
import { getUserById } from "~/db/repo_user";

export const { getSession, commitSession, destroySession } =
  createCookieSessionStorage({
    cookie: {
      name: "authentication",
      maxAge: 60 * 60 * 24, // 24 hours
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      secrets: [process.env.SESSION_SECRET!],
    },
  });

export const storeUserInSession = async (userId: string) => {
  const session = await getSession();
  session.set("userId", userId);
  const header = await commitSession(session);
  
  return header;
};

export const getUserIdFromSession = async (request: Request) => {
  const session = await getSession(request.headers.get("Cookie"));
  const userId = session.get("userId");
  return userId;
};

export const requireUser = async (request: Request) => {
  const userId = await getUserIdFromSession(request);
  if (!userId) {
    console.log("No userId in session, redirecting to /auth/signin ====");
    throw redirect("/auth/signin");
  }
  const user = await getUserById(userId);
  if (!user) {
    console.log("User not found, redirecting to /auth/signin");
    throw redirect("/auth/signin");
  }
  return user.id;
};
