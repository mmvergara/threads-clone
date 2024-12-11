import { Intent } from "~/utils/intents";
import {
  likeThreadAction,
  unlikeThreadAction,
} from "./services/thread-likes-actions";
import { createThreadAction } from "./services/threads-actions";
import {
  updateProfileDataAction,
  updateProfileImgAction,
} from "./services/user-actions";
import { requireUser } from "./session/session";
import { handleCatchErrorAction } from "./utils/action-utils";



export const universalActionHandler = async (request: Request) => {
  let intent: string = "";
  try {
    const currentUser = await requireUser(request);
    const formData = await request.formData();
    intent = formData.get("intent") as string;
    switch (intent) {
      case Intent.CreateThread:
        return createThreadAction(currentUser.id, formData);
      case Intent.LikeThread:
        return likeThreadAction(currentUser.id, formData);
      case Intent.UnlikeThread:
        return unlikeThreadAction(currentUser.id, formData);
      case Intent.UpdateProfileData:
        return updateProfileDataAction(currentUser.id, formData);
      case Intent.UpdateProfileImage:
        return updateProfileImgAction(currentUser.id, formData);
      default:
        throw new Error("Invalid intent");
    }
  } catch (error) {
    return handleCatchErrorAction(error, intent);
  }
};
