import { LoaderFunctionArgs, redirect, MetaFunction } from "@remix-run/node";
import { requireUser } from "~/.server/services/session";
import { Outlet, ShouldRevalidateFunction } from "@remix-run/react";
import { getUserById } from "~/.server/services/user";

// TODO: Implement Granular Error Handling
export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const currentUser = await requireUser(request);
  const requestUrl = new URL(request.url);
  const profilePath = requestUrl.pathname;

  if (profilePath === "/profile") {
    throw redirect(`/profile/${currentUser.id}`);
  }

  const profileId = params.userId || currentUser.id;
  const user = await getUserById(profileId);

  if (!user) {
    throw redirect("/");
  }

  return { user };
};

export const shouldRevalidate: ShouldRevalidateFunction = ({
  currentParams,
  nextParams,
}) => {
  return currentParams.userId !== nextParams.userId;
};

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data?.user) {
    return [
      { title: "Profile Not Found" },
      { name: "description", content: "Profile page not found" },
    ];
  }

  return [
    { title: `${data.user.displayName}'s Profile` },
    {
      name: "description",
      content: `View ${data.user.displayName}'s profile and activities`,
    },
    { property: "og:title", content: `${data.user.displayName}'s Profile` },
    {
      property: "og:description",
      content: `View ${data.user.displayName}'s profile and activities`,
    },
  ];
};

const ProfilePageLayout = () => {
  return (
    <div className="flex flex-col w-full">
      <Outlet />
    </div>
  );
};

export default ProfilePageLayout;
