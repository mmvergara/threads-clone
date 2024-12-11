import { LoaderFunctionArgs, ActionFunctionArgs } from "@remix-run/node";
import { requireUser } from "~/.server/session/session";
import { Form, Link, useActionData, useLoaderData } from "@remix-run/react";
import CreateThreadModal from "~/components/create-thread-modal";
import { useEffect, useRef, useState } from "react";
import { User } from "~/.server/db/schema";
import {
  updateProfileDataAction,
  updateProfileImgAction,
} from "~/.server/intent-actions/update-profile";
import {
  ActionReturnType,
  handleCatchErrorAction,
} from "~/.server/utils/action-utils";
import { toastActionData } from "~/utils/toast";
import { toast } from "react-toastify";
import { UploadButton } from "~/utils/uploadthing";
import { ImageUpIcon } from "lucide-react";
import EditProfileModal from "~/components/edit-profile-modal";
import UploadProfileModal from "~/components/upload-profile-modal";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await requireUser(request);
  return { user };
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

const ProfilePage = () => {
  const [isThreadModalOpen, setIsThreadModalOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const { user } = useLoaderData<Awaited<ReturnType<typeof loader>>>();
  return (
    <div className="flex flex-col w-full">
      <div className="px-6 py-10">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h1 className="text-xl font-bold text-white">
              {user?.displayName}
            </h1>
            <p className="text-white">@{user?.handle}</p>
            <p className="text-white mt-4">{user?.bio}</p>
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

        <div className="flex gap-4 mt-6">
          <Link
            to="/app/profile"
            className="flex-1 text-center py-3 text-white border-b-2 border-white"
          >
            Threads
          </Link>
          <Link
            to="/app/profile/replies"
            className="flex-1 text-center py-3 text-zinc-500"
          >
            Replies
          </Link>
          <Link
            to="/app/profile/reposts"
            className="flex-1 text-center py-3 text-zinc-500"
          >
            Reposts
          </Link>
        </div>
      </div>

      <div className="flex flex-col gap-4 mt-4">
        <div className="flex items-center gap-3 px-6 py-4">
          <img
            src="https://via.placeholder.com/40x40"
            alt="User avatar"
            className="w-10 h-10 rounded-full"
          />
          <button
            onClick={() => setIsThreadModalOpen(true)}
            className="flex-1 text-left text-zinc-500 text-lg"
          >
            What's new?
          </button>
          <button
            onClick={() => setIsThreadModalOpen(true)}
            className={`px-4 py-2 rounded-full bg-zinc-800 text-zinc-500`}
          >
            Post
          </button>
        </div>
        <CreateThreadModal
          isOpen={isThreadModalOpen}
          setIsOpen={setIsThreadModalOpen}
        />
        <EditProfileModal
          isOpen={isEditProfileOpen}
          setIsOpen={setIsEditProfileOpen}
          user={user}
        />
        <UploadProfileModal
          isOpen={isUploadModalOpen}
          setIsOpen={setIsUploadModalOpen}
        />
        <div className="text-center text-zinc-500 py-8">No threads yet</div>
      </div>
    </div>
  );
};

export default ProfilePage;
