import { useActionData } from "@remix-run/react";
import { ActionReturnType } from "~/.server/utils/action-utils";

export enum Intent {
  CreateThread = "createThread",

  UpdateProfileData = "updateProfileData",
  UpdateProfileImage = "updateProfileImage",
  FollowUser = "followUser",
  UnfollowUser = "unfollowUser",

  LikeThread = "likeThread",
  UnlikeThread = "unlikeThread",
  
  RepostThread = "repostThread",
  UnrepostThread = "unrepostThread",
  Logout = "logout",
}

export const useUniversalActionData = () => {
  return useActionData() as ActionReturnType;
};
