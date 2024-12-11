import { likeThread, unlikeThread } from "../services/thread-likes";
import { handleActionSuccess } from "../utils/action-utils";

export const unlikeThreadAction = async (userId: string, formData: FormData) => {
  const threadId = formData.get("threadId") as string;
  const thread = await unlikeThread(threadId, userId);
  return handleActionSuccess("Thread unliked successfully", "unlikeThread", thread);
};
