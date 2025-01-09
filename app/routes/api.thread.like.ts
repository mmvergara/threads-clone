import { ActionFunctionArgs } from "@remix-run/node";
import { toggleLikeThread } from "~/.server/services/thread-interactions";
import { requireUser } from "~/.server/session/session";

export const action = async ({ request }: ActionFunctionArgs) => {
  if (request.method !== "POST") {
    return { status: 405, error: "Method not allowed" };
  }

  try {
    const currentUser = await requireUser(request);
    const formData = await request.formData();
    const threadId = formData.get("threadId") as string;
    const isLiked = await toggleLikeThread(threadId, currentUser.id);
    return { isLiked };
  } catch (error) {
    console.error(error);
    return { error: "Something went wrong" };
  }
};
