import { useActionData } from "@remix-run/react";
import { ActionReturnType } from "~/.server/utils/action-utils";

export enum Intent {
  UpdateProfileData = "updateProfileData",
}

export const useUniversalActionData = () => {
  return useActionData() as ActionReturnType;
};
