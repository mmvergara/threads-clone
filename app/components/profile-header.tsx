import { Link, useLocation } from "@remix-run/react";
import { User } from "~/.server/db/schema";
import EditProfileModal from "./edit-profile-modal";
import UploadProfileModal from "./upload-profile-image-modal";
import { useState } from "react";
import { cn } from "~/utils/formatters";

type Props = {
  user: User;
};
const ProfileHeader = ({ user }: Props) => {
  const location = useLocation();

  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  return (
    <section className="">
      <div className="px-6 py-10">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h1 className="text-xl font-bold text-white">
              {user?.displayName}
            </h1>
            <p className="text-white">@{user?.handle}</p>
            <p className="tAext-white mt-4">{user?.bio}</p>
            <div className="flex items-center gap-2 mt-4">
              <span className="text-zinc-500 text-sm">85 followers</span>
            </div>
          </div>
          <img
            src={user.profileImageUrl || "https://via.placeholder.com/40x40"}
            alt="Profile Image"
            className="w-20 h-20 rounded-full cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => setIsUploadModalOpen(true)}
          />
        </div>

        <div className="flex gap-2 mt-6">
          <button
            onClick={() => setIsEditProfileOpen(true)}
            className="flex-1 px-4 py-1.5 border-[1px] font-bold border-zinc-600 rounded-lg text-white"
          >
            Edit profile
          </button>
        </div>
      </div>

      <div className="flex mt-6 text-zinc-500 font-semibold">
        <Link
          to={`/profile/${user.id}`}
          className={cn(
            "flex-1 text-center py-3 border-b-[1px]",
            location.pathname.endsWith(`/${user.id}`)
              ? "border-white text-white"
              : "border-zinc-700"
          )}
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
        >
          Reposts
        </Link>
      </div>

      <EditProfileModal
        isOpen={isEditProfileOpen}
        setIsOpen={setIsEditProfileOpen}
        user={user}
      />
      <UploadProfileModal
        isOpen={isUploadModalOpen}
        setIsOpen={setIsUploadModalOpen}
      />
    </section>
  );
};

export default ProfileHeader;
