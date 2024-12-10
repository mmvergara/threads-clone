import { createThread } from "../services/thread";
import { handleActionSuccess } from "../utils/action-utils";

export const createThreadAction = async (
  userId: string,
  formData: FormData
) => {
  const content = formData.get("content") as string;
  const imagesUrlJsonString = formData.get("images") as string;
  const parentThreadId = formData.get("parentThreadId") as string | undefined;
  const thread = await createThread({
    userId,
    content,
    imagesUrlJsonString,
    parentThreadId,
  });
  return handleActionSuccess(
    "Thread created successfully",
    "createThread",
    thread
  );
};
