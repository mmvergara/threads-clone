import { likeThread, unlikeThread } from "./thread-likes";
import { handleActionSuccess } from "../utils/action-utils";

export const likeThreadAction = async (
  currentUserId: string,
  formData: FormData
) => {
  const threadId = formData.get("threadId") as string;
  const thread = await likeThread(threadId, currentUserId);
  return handleActionSuccess("Thread liked successfully", "likeThread", thread);
};

export const unlikeThreadAction = async (
  userId: string,
  formData: FormData
) => {
  const threadId = formData.get("threadId") as string;
  const thread = await unlikeThread(threadId, userId);
  return handleActionSuccess(
    "Thread unliked successfully",
    "unlikeThread",
    thread
  );
};
