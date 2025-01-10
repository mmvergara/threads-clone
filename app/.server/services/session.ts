import { createCookieSessionStorage, redirect } from "@remix-run/node";
import { getUserById } from "~/.server/services/user";

export const { getSession, commitSession, destroySession } =
  createCookieSessionStorage({
    cookie: {
      name: "authentication",
      // maxAge: 10, // 1 minute
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

export const removeUserFromSession = async () => {
  const session = await getSession();
  session.unset("userId");
  const header = await commitSession(session);
  return header;
};

export const getUserIdFromSession = async (request: Request) => {
  const session = await getSession(request.headers.get("Cookie"));
  const userId = session.get("userId") as string;
  return userId;
};

export const requireUser = async (request: Request) => {
  const userId = await getUserIdFromSession(request);
  if (!userId) {
    throw redirect("/signin");
  }
  const user = await getUserById(userId);
  if (!user) {
    throw redirect("/signin");
  }
  return user;
};
