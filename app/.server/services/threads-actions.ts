import { z } from "zod";
import { Intent } from "~/utils/client-action-utils";
import { handleActionSuccess } from "../utils/action-utils";
import { createThread } from "./threads";

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
