import { ActionFunctionArgs } from "@remix-run/node";
import { z } from "zod";
import {
  updateUserProfileData,
  updateUserProfileImage,
} from "~/.server/services/user";
import { requireUser } from "~/.server/session/session";

const updateProfileDataSchema = z.object({
  displayName: z
    .string({ message: "displayName is required." })
    .min(3, "displayName must be 3 characters or more")
    .max(30, "displayName must be 30 characters or less"),
  bio: z
    .string({ message: "bio is required." })
    .max(254, "Bio must be 254 characters or less"),
});

export const action = async ({ request }: ActionFunctionArgs) => {
  if (request.method !== "POST") {
    throw new Response("Method not allowed", { status: 405 });
  }
  try {
    const currentUser = await requireUser(request);
    const formData = await request.formData();
    const valid = updateProfileDataSchema.parse({
      displayName: formData.get("displayName"),
      bio: formData.get("bio"),
    });
    await updateUserProfileData({
      currentUserId: currentUser.id,
      displayName: valid.displayName,
      bio: valid.bio,
    });

    const profileImageUrl = formData.get("profileImageUrl") as string;
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
