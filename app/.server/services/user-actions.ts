import { Intent } from "~/utils/client-action-utils";
import { handleActionSuccess } from "../utils/action-utils";
import {
  followUser,
  unfollowUser,
  updateUserProfileData,
  updateUserProfileImage,
} from "./user";

export const updateProfileDataAction = async (
  userId: string,
  formData: FormData,
  intent: Intent
) => {
  const displayName = formData.get("displayName") as string;
  const bio = formData.get("bio") as string;
  const user = await updateUserProfileData(userId, {
    displayName,
    bio,
  });
  return handleActionSuccess("Profile updated", intent, user);
};

export const updateProfileImgAction = async (
  userId: string,
  formData: FormData,
  intent: Intent
) => {
  const profileImageUrl = formData.get("profileImageUrl") as string;
  const user = await updateUserProfileImage(userId, profileImageUrl);
  return handleActionSuccess("Profile image updated", intent, user);
};

export const followUserAction = async (
  currentUserId: string,
  formData: FormData,
  intent: Intent
) => {
  const toFollowUserId = formData.get("toFollowUserId") as string;
  const user = await followUser(currentUserId, toFollowUserId);
  return handleActionSuccess("User followed", intent, user);
};

export const unfollowUserAction = async (
  currentUserId: string,
  formData: FormData,
  intent: Intent
) => {
  const toUnfollowUserId = formData.get("toUnfollowUserId") as string;
  const user = await unfollowUser(currentUserId, toUnfollowUserId);
  return handleActionSuccess("User unfollowed", intent, user);
};
