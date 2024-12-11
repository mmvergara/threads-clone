import { likeThread, unlikeThread } from "./thread-likes";
import { handleActionSuccess } from "../utils/action-utils";
import { Intent } from "~/utils/client-action-utils";

export const likeThreadAction = async (
  currentUserId: string,
  formData: FormData,
  intent: Intent
) => {
  const threadId = formData.get("threadId") as string;
  const thread = await likeThread(threadId, currentUserId);
  return handleActionSuccess("", intent, thread);
};

export const unlikeThreadAction = async (
  userId: string,
  formData: FormData,
  intent: Intent
) => {
  const threadId = formData.get("threadId") as string;
  const thread = await unlikeThread(threadId, userId);
  return handleActionSuccess("", intent, thread);
};
