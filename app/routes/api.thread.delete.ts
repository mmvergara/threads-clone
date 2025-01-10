import { ActionFunctionArgs } from "@remix-run/node";
import { deleteThread } from "~/.server/services/threads";
import { requireUser } from "~/.server/session/session";

export const action = async ({ request }: ActionFunctionArgs) => {
  if (request.method !== "POST") {
    return { status: 405, error: "Method not allowed" };
  }
  try {
    const currentUser = await requireUser(request);
    const formData = await request.formData();
    const threadId = formData.get("threadId") as string;
    const parentThreadId = formData.get("parentThreadId") as string;
    await deleteThread({
      threadId,
      parentThreadId,
      currentUserId: currentUser.id,
    });
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Something went wrong" };
  }
};
