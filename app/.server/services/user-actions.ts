import { handleActionSuccess } from "../utils/action-utils";
import { updateUserProfileData, updateUserProfileImage } from "./user";

export const updateProfileDataAction = async (
  userId: string,
  formData: FormData
) => {
  const displayName = formData.get("displayName") as string;
  const bio = formData.get("bio") as string;
  const user = await updateUserProfileData(userId, {
    displayName,
    bio,
  });
  return handleActionSuccess(
    "Profile updated successfully",
    "updateProfileData",
    user
  );
};

export const updateProfileImgAction = async (
  userId: string,
  formData: FormData
) => {
  const profileImageUrl = formData.get("profileImageUrl") as string;
  const user = await updateUserProfileImage(userId, profileImageUrl);
  return handleActionSuccess(
    "Profile image updated successfully",
    "updateProfileImg",
    user
  );
};
