import {
  LoaderFunctionArgs,
  ActionFunctionArgs,
  redirect,
} from "@remix-run/node";
import { requireUser } from "~/.server/session/session";
import { Outlet, ShouldRevalidateFunction } from "@remix-run/react";
import { getUserById } from "~/.server/services/user";
import { universalActionHandler } from "~/.server/action-handler";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const currentUser = await requireUser(request);
  const requestUrl = new URL(request.url);
  const profilePath = requestUrl.pathname;

  // If the path is exactly "/profile", redirect to current user's profile
  if (profilePath === "/profile") {
    throw redirect(`/profile/${currentUser.id}`);
  }

  // Determine which profile to load
  const profileId = params.userId || currentUser.id;

  // Fetch the user to be displayed
  const user = await getUserById(profileId);

  // If no user is found, redirect to home
  if (!user) {
    throw redirect("/");
  }

  return null;
};

export const shouldRevalidate: ShouldRevalidateFunction = ({
  currentParams,
  nextParams,
}) => {
  return currentParams.userId !== nextParams.userId;
};

export const action = async ({ request }: ActionFunctionArgs) =>
  universalActionHandler(request);

const ProfilePageLayout = () => {
  return (
    <div className="flex flex-col w-full">
      <Outlet />
    </div>
  );
};

export default ProfilePageLayout;
