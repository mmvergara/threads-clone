import { Link, useFetcher, useLocation } from "@remix-run/react";
import { User } from "~/.server/db/schema";
import EditProfileModal from "./edit-profile-modal";
import UploadProfileModal from "./upload-profile-image-modal";
import { useState } from "react";
import { cn } from "~/utils/formatters";
import { useToastAction } from "~/hooks/useToastAction";

type Props = {
  user: User;
  isCurrentUser: boolean;
  isFollowed: boolean;
};
const ProfileHeader = ({ user, isCurrentUser, isFollowed }: Props) => {
  const location = useLocation();
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const followFetcher = useFetcher();
  useToastAction(followFetcher.data);
  return (
    <header role="banner" aria-label="Profile header">
      <div className="px-6 pt-10">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h1 className="text-xl font-bold text-white">
              {user?.displayName}
            </h1>
            <p className="text-white" aria-label="Username">
              @{user?.handle}
            </p>
            <p className="text-white mt-4" aria-label="Bio">
              {user?.bio}
            </p>
            <div className="flex items-center gap-2 mt-4">
              <span
                className="text-zinc-500 text-sm"
                aria-label="Follower count"
              >
                {user?.followers} followers
              </span>
            </div>
          </div>
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="w-20 h-20 rounded-full hover:opacity-80 transition-opacity"
            aria-label="Change profile picture"
          >
            <img
              src={user.profileImageUrl || "https://via.placeholder.com/40x40"}
              alt={`${user.displayName}'s profile picture`}
              className="w-full h-full rounded-full"
            />
          </button>
        </div>

        <followFetcher.Form
          method="post"
          action="/api/user/follow"
          className="flex gap-2 mt-6"
        >
          <input
            type="hidden"
            name="toFollowUserId"
            value={user.id}
            aria-hidden="true"
          />
          {isCurrentUser ? (
            <button
              onClick={() => setIsEditProfileOpen(true)}
              className="flex-1 px-4 py-1.5 border-[1px] font-bold border-zinc-600 rounded-lg text-white"
              aria-label="Edit profile"
            >
              Edit profile
            </button>
          ) : (
            <button
              type="submit"
              className="flex-1 px-4 py-1.5 border-[1px] font-bold border-zinc-600 rounded-lg text-white hover:text-red-500 hover:border-red-500 transition-colors"
              aria-label="Unfollow user"
            >
              {isFollowed ? "Unfollow" : "Follow"}
            </button>
          )}
        </followFetcher.Form>
      </div>

      <nav
        className="flex mt-4 text-zinc-500 font-semibold"
        aria-label="Profile sections"
      >
        <Link
          to={`/profile/${user.id}`}
          className={cn(
            "flex-1 text-center py-3 border-b-[1px]",
            location.pathname.endsWith(`/${user.id}`)
              ? "border-white text-white"
              : "border-zinc-700"
          )}
          aria-current={
            location.pathname.endsWith(`/${user.id}`) ? "page" : undefined
          }
        >
          Threads
        </Link>
        <Link
          to={`/profile/${user.id}/replies`}
          className={cn(
            "flex-1 text-center py-3 border-b-[1px]",
            location.pathname.endsWith("/replies")
              ? "border-white text-white"
              : "border-zinc-700"
          )}
          aria-current={
            location.pathname.endsWith("/replies") ? "page" : undefined
          }
        >
          Replies
        </Link>
        <Link
          to={`/profile/${user.id}/reposts`}
          className={cn(
            "flex-1 text-center py-3 border-b-[1px]",
            location.pathname.endsWith("/reposts")
              ? "border-white text-white"
              : "border-zinc-700"
          )}
          aria-current={
            location.pathname.endsWith("/reposts") ? "page" : undefined
          }
        >
          Reposts
        </Link>
      </nav>

      <EditProfileModal
        isOpen={isEditProfileOpen}
        setIsOpen={setIsEditProfileOpen}
        user={user}
      />
      <UploadProfileModal
        isOpen={isUploadModalOpen}
        setIsOpen={setIsUploadModalOpen}
      />
    </header>
  );
};

export default ProfileHeader;
