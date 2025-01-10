import { ActionFunctionArgs } from "@remix-run/node";
import { z } from "zod";
import { deleteThread } from "~/.server/services/threads";
import { requireUser } from "~/.server/services/session";
import { handleServerError } from "~/.server/utils/error-handler";

const deleteThreadSchema = z.object({
  threadId: z
    .string({ message: "Thread Id is required." })
    .length(10, "Invalid thread id"),
  parentThreadId: z
    .string({
      message: "Parent Thread Id is required.",
    })
    .length(10, "Invalid parent thread id"),
});

export const action = async ({ request }: ActionFunctionArgs) => {
  if (request.method !== "POST") {
    return { status: 405, error: "Method not allowed" };
  }
  try {
    const currentUser = await requireUser(request);
    const formData = await request.formData();

    const valid = deleteThreadSchema.parse({
      threadId: formData.get("threadId"),
      parentThreadId: formData.get("parentThreadId"),
    });

    await deleteThread({
      threadId: valid.threadId,
      parentThreadId: valid.parentThreadId,
      currentUserId: currentUser.id,
    });
    return { success: true };
  } catch (error) {
    return handleServerError(error);
  }
};
