import { ActionFunctionArgs } from "@remix-run/node";
import { z } from "zod";
import { createThread } from "~/.server/services/threads";
import { requireUser } from "~/.server/services/session";
import { handleServerError } from "~/.server/utils/error-handler";

const createThreadSchema = z.object({
  content: z.string().min(1, "Content is required"),
  images: z
    .string()
    .refine(
      (value) => {
        try {
          const images = JSON.parse(value);
          if (images.length > 5) return false;
          for (const image of images) {
            new URL(image);
          }
          return true;
        } catch (error) {
          return false;
        }
      },
      {
        message: "Images must be a valid url and only 5 images are allowed",
      }
    )
    .optional(),
  parentThreadId: z.string().nullable().optional(),
});

export const action = async ({ request }: ActionFunctionArgs) => {
  if (request.method !== "POST") {
    return { status: 405, error: "Method not allowed" };
  }

  try {
    const currentUser = await requireUser(request);
    const formData = await request.formData();

    const valid = createThreadSchema.parse({
      content: formData.get("content"),
      images: formData.get("images"),
      parentThreadId: formData.get("parentThreadId"),
    });
    await createThread({
      content: valid.content.trim(),
      imagesUrlJsonString: valid.images || "[]",
      parentThreadId: valid?.parentThreadId || undefined,
      currentUserId: currentUser.id,
    });
    return { success: "Thread created successfully" };
  } catch (error) {
    return handleServerError(error);
  }
};
