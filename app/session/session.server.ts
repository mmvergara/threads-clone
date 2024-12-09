import { createCookieSessionStorage } from "@remix-run/node";

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
