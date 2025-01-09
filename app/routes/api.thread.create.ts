import { ActionFunctionArgs } from "@remix-run/node";
import { createThread } from "~/.server/services/threads";
import { requireUser } from "~/.server/session/session";

export const action = async ({ request }: ActionFunctionArgs) => {
  if (request.method !== "POST") {
    return { status: 405, error: "Method not allowed" };
  }
  console.log("Create thread action running");

  try {
    const currentUser = await requireUser(request);
    const formData = await request.formData();
    const content = formData.get("content") as string;
    const images = formData.get("images") as string;
    const parentThreadId = formData.get("parentThreadId") as string;
    const isLiked = await createThread({
      content,
      imagesUrlJsonString: images,
      parentThreadId,
      currentUserId: currentUser.id,
    });
    return { isLiked };
  } catch (error) {
    console.error(error);
    return { error: "Something went wrong" };
  }
};
