import { ActionFunctionArgs } from "@remix-run/node";
import { toggleRepostThread } from "~/.server/services/thread-interactions";
import { requireUser } from "~/.server/session/session";

export const action = async ({ request }: ActionFunctionArgs) => {
  if (request.method !== "POST") {
    return { status: 405, error: "Method not allowed" };
  }

  try {
    const currentUser = await requireUser(request);
    const formData = await request.formData();
    const threadId = formData.get("threadId") as string;
    await toggleRepostThread({
      threadId,
      currentUserId: currentUser.id,
    });
    return null;
  } catch (error) {
    console.error(error);
    return { error: "Something went wrong" };
  }
};
