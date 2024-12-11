import { Intent } from "~/utils/client-action-utils";
import { handleActionSuccess } from "../utils/action-utils";
import { createThread } from "./threads";

export const createThreadAction = async (
  currentUserId: string,
  formData: FormData,
  intent: Intent
) => {
  const content = formData.get("content") as string;
  const imagesUrlJsonString = formData.get("images") as string;
  const parentThreadId = formData.get("parentThreadId") as string | undefined;
  const thread = await createThread({
    userId: currentUserId,
    content,
    imagesUrlJsonString,
    parentThreadId,
  });
  return handleActionSuccess("Thread created", intent, thread);
};
