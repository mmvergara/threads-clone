import { ActionFunctionArgs } from "@remix-run/node";
import { z } from "zod";
import { toggleFollowUser } from "~/.server/services/user";
import { requireUser } from "~/.server/services/session";
import { handleServerError } from "~/.server/utils/error-handler";

export const action = async ({ request }: ActionFunctionArgs) => {
  if (request.method !== "POST") {
    throw new Response("Method not allowed", { status: 405 });
  }
  try {
    const currentUser = await requireUser(request);
    const formData = await request.formData();
    const toFollowUserId = z
      .string({
        message: "toFollowUserId is required.",
      })
      .length(10, "Invalid toFollowUserId")
      .parse(formData.get("toFollowUserId"));

    const { followed } = await toggleFollowUser({
      followerUserId: currentUser.id,
      toFollowUserId,
    });
    return { success: followed ? "Followed" : "Unfollowed" };
  } catch (error) {
    handleServerError(error);
  }
};
