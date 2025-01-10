import { ActionFunctionArgs } from "@remix-run/node";
import { updateUserProfileImage } from "~/.server/services/user";
import { requireUser } from "~/.server/session/session";

export const action = async ({ request }: ActionFunctionArgs) => {
  if (request.method !== "POST") {
    return { status: 405, error: "Method not allowed" };
  }
  try {
    const currentUser = await requireUser(request);
    const formData = await request.formData();
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
