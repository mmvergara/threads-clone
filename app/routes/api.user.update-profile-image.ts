import { ActionFunctionArgs } from "@remix-run/node";
import { z } from "zod";
import { updateUserProfileImage } from "~/.server/services/user";
import { requireUser } from "~/.server/services/session";

export const action = async ({ request }: ActionFunctionArgs) => {
  if (request.method !== "POST") {
    throw new Response("Method not allowed", { status: 405 });
  }
  try {
    const currentUser = await requireUser(request);
    const formData = await request.formData();
    const profileImageUrl = z
      .string({ message: "profileImageUrl is required." })
      .url()
      .parse(formData.get("profileImageUrl"));
    await updateUserProfileImage({
      currentUserId: currentUser.id,
      profileImageUrl,
    });
    return null;
  } catch (error) {
    console.error(error);
    return { error: "Something went wrong" };
  }
};
