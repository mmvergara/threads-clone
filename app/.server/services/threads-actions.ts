import { z } from "zod";
import { Intent } from "~/utils/client-action-utils";
import { handleActionError, handleActionSuccess } from "../utils/action-utils";
import { createThread, deleteThread, getThreadById } from "./threads";

const createThreadSchema = z.object({
  content: z.string().min(1, "Content is required"),
  images: z.string().transform((str, ctx): z.infer<ReturnType<any>> => {
    try {
      JSON.parse(str);
      return str;
    } catch (e) {
      ctx.addIssue({ code: "custom", message: "Invalid Images" });
      return z.NEVER;
    }
  }),
  parentThreadId: z.string().nullable().optional(),
});

export const createThreadAction = async (
  currentUserId: string,
  formData: FormData,
  intent: Intent
) => {
  const { content, images, parentThreadId } =
    await createThreadSchema.parseAsync({
      content: formData.get("content"),
      images: formData.get("images"),
      parentThreadId: formData.get("parentThreadId"),
    });
  const thread = await createThread({
    userId: currentUserId,
    content,
    imagesUrlJsonString: images,
    parentThreadId: parentThreadId ?? undefined,
  });
  return handleActionSuccess("Thread created", intent, thread);
};

export const deleteThreadAction = async (
  currentUserId: string,
  formData: FormData,
  intent: Intent
) => {
  const threadId = formData.get("threadId") as string;

  const thread = await getThreadById(threadId);

  if (thread.userId !== currentUserId) {
    return handleActionError(
      ["You are not allowed to delete this thread"],
      intent
    );
  }

  await deleteThread(threadId);

  return handleActionSuccess("Thread deleted", intent);
};
