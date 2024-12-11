import { likeThread } from "../services/thread-likes";
import { handleActionSuccess } from "../utils/action-utils";

export const likeThreadAction = async (userId: string, formData: FormData) => {
  const threadId = formData.get("threadId") as string;
  const thread = await likeThread(threadId, userId);
  return handleActionSuccess("Thread liked successfully", "likeThread", thread);
};
