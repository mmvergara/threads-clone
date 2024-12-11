import { Intent } from "~/utils/client-action-utils";
import {
  likeThreadAction,
  unlikeThreadAction,
} from "./services/thread-likes-actions";
import { createThreadAction } from "./services/threads-actions";
import {
  followUserAction,
  unfollowUserAction,
  updateProfileDataAction,
  updateProfileImgAction,
} from "./services/user-actions";
import { requireUser } from "./session/session";
import { handleCatchErrorAction } from "./utils/action-utils";

export const universalActionHandler = async (request: Request) => {
  let intent: string = "";

  // Log request path
  try {
    const currentUser = await requireUser(request);
    const formData = await request.formData();
    intent = formData.get("intent") as string;
    console.log(request.url, "=", intent);
    switch (intent) {
      case Intent.CreateThread:
        return createThreadAction(currentUser.id, formData, intent);
      case Intent.LikeThread:
        return likeThreadAction(currentUser.id, formData, intent);
      case Intent.UnlikeThread:
        return unlikeThreadAction(currentUser.id, formData, intent);
      case Intent.UpdateProfileData:
        return updateProfileDataAction(currentUser.id, formData, intent);
      case Intent.UpdateProfileImage:
        return updateProfileImgAction(currentUser.id, formData, intent);
      case Intent.FollowUser:
        return followUserAction(currentUser.id, formData, intent);
      case Intent.UnfollowUser:
        return unfollowUserAction(currentUser.id, formData, intent);
      default:
        throw new Error("Invalid intent");
    }
  } catch (error) {
    return handleCatchErrorAction(error, intent);
  }
};
