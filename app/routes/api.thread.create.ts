import { ActionFunctionArgs } from "@remix-run/node";
import { z } from "zod";
import { createThread } from "~/.server/services/threads";
import { requireUser } from "~/.server/session/session";

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
  console.log("Create thread action running");

  try {
    const currentUser = await requireUser(request);
    const formData = await request.formData();

    const valid = createThreadSchema.parse({
      content: formData.get("content"),
      images: formData.get("images"),
      parentThreadId: formData.get("parentThreadId"),
    });
    const isLiked = await createThread({
      content: valid.content.trim(),
      imagesUrlJsonString: valid.images || "[]",
      parentThreadId: valid?.parentThreadId || undefined,
      currentUserId: currentUser.id,
    });
    return { isLiked };
  } catch (error) {
    console.error(error);
    return { error: "Something went wrong" };
  }
};
