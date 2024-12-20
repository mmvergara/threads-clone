import { Intent } from "~/utils/client-action-utils";
import {
  likeThreadAction,
  repostThreadAction,
  unlikeThreadAction,
  unrepostThreadAction,
} from "./services/thread-interaction-actions";
import {
  createThreadAction,
  deleteThreadAction,
} from "./services/threads-actions";
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
        return await createThreadAction(currentUser.id, formData, intent);
      case Intent.DeleteThread:
        return await deleteThreadAction(currentUser.id, formData, intent);
      case Intent.LikeThread:
        return await likeThreadAction(currentUser.id, formData, intent);
      case Intent.UnlikeThread:
        return await unlikeThreadAction(currentUser.id, formData, intent);
      case Intent.UpdateProfileData:
        return await updateProfileDataAction(currentUser.id, formData, intent);
      case Intent.UpdateProfileImage:
        return await updateProfileImgAction(currentUser.id, formData, intent);
      case Intent.FollowUser:
        return await followUserAction(currentUser.id, formData, intent);
      case Intent.UnfollowUser:
        return await unfollowUserAction(currentUser.id, formData, intent);
      case Intent.RepostThread:
        return await repostThreadAction(currentUser.id, formData, intent);
      case Intent.UnrepostThread:
        return await unrepostThreadAction(currentUser.id, formData, intent);
      default:
        throw new Error("Invalid intent");
    }
  } catch (error) {
    return handleCatchErrorAction(error, intent);
  }
};
