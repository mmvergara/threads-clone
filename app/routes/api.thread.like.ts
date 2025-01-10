import { ActionFunctionArgs } from "@remix-run/node";
import { z } from "zod";
import { toggleLikeThread } from "~/.server/services/thread-interactions";
import { requireUser } from "~/.server/services/session";
import { handleServerError } from "~/.server/utils/error-handler";

export const action = async ({ request }: ActionFunctionArgs) => {
  if (request.method !== "POST") {
    return { status: 405, error: "Method not allowed" };
  }
  try {
    const currentUser = await requireUser(request);
    const formData = await request.formData();
    const threadId = z
      .string({
        message: "Thread Id is required.",
      })
      .length(10, "Invalid thread id")
      .parse(formData.get("threadId"));

    const { liked } = await toggleLikeThread(threadId, currentUser.id);
    return { success: liked ? "Thread liked" : "Thread unliked" };
  } catch (error) {
    return handleServerError(error);
  }
};
