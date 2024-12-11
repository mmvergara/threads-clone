import {
  LoaderFunctionArgs,
  ActionFunctionArgs,
  redirect,
} from "@remix-run/node";
import { requireUser } from "~/.server/session/session";
import {
  Outlet,
  ShouldRevalidateFunction,
  useLoaderData,
} from "@remix-run/react";
import {
  updateProfileDataAction,
  updateProfileImgAction,
} from "~/.server/intent-actions/update-profile";
import { handleCatchErrorAction } from "~/.server/utils/action-utils";
import { getUserById } from "~/.server/services/user";
import { User } from "~/.server/db/schema";
import ProfileHeader from "~/components/profile-header";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const currentUser = await requireUser(request);
  const requestUrl = new URL(request.url);
  const profilePath = requestUrl.pathname;
  console.log("profilePath", profilePath);

  // If the path is exactly "/profile", redirect to current user's profile
  if (profilePath === "/profile") {
    return redirect(`/profile/${currentUser.id}`);
  }

  // Determine which profile to load
  const profileId = params.userId || currentUser.id;
  console.log("profileId", profileId);
  // Fetch the user to be displayed
  const user = await getUserById(profileId);

  // If no user is found, redirect to home
  if (!user) {
    return redirect("/");
  }

  return user;
};

export const shouldRevalidate: ShouldRevalidateFunction = ({
  currentParams,
  nextParams,
}) => {
  return currentParams.userId !== nextParams.userId;
};

export const action = async ({ request }: ActionFunctionArgs) => {
  let intent: string = "";
  try {
    const user = await requireUser(request);
    const formData = await request.formData();
    intent = formData.get("intent") as string;
    switch (intent) {
      case "updateProfileData":
        return updateProfileDataAction(user.id, formData);
      case "updateProfileImage":
        return updateProfileImgAction(user.id, formData);
      default:
        throw new Error("Invalid intent");
    }
  } catch (error) {
    return handleCatchErrorAction(error, intent);
  }
};

const ProfilePageLayout = () => {
  const user = useLoaderData() as User;

  return (
    <div className="flex flex-col w-full">
      <ProfileHeader user={user} />
      <Outlet />
    </div>
  );
};

export default ProfilePageLayout;
