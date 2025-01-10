import { ActionFunctionArgs } from "@remix-run/node";
import { toggleFollowUser } from "~/.server/services/user";
import { requireUser } from "~/.server/session/session";

export const action = async ({ request }: ActionFunctionArgs) => {
  if (request.method !== "POST") {
    return { status: 405, error: "Method not allowed" };
  }
  try {
    const currentUser = await requireUser(request);
    const formData = await request.formData();
    const toFollowUserId = formData.get("toFollowUserId") as string;
    await toggleFollowUser({
      followerUserId: currentUser.id,
      toFollowUserId,
    });
    return null;
  } catch (error) {
    console.error(error);
    return { error: "Something went wrong" };
  }
};
