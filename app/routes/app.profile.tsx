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
import { UploadDropzone } from "~/utils/uploadthing";
import { toast } from "react-toastify";
import { UploadButton } from "~/utils/uploadthing";
import { ImageUpIcon } from "lucide-react";

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

const EditProfileModal = ({
  isOpen,
  setIsOpen,
  user,
}: {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  user: User;
}) => {
  const actionData = useActionData() as ActionReturnType;
  useEffect(() => {
    toastActionData(actionData, "updateProfileData");
    if (actionData?.success) {
      setIsOpen(false);
    }
  }, [actionData]);
  return (
    <div className={`fixed inset-0 bg-black/80 z-50 ${isOpen ? "" : "hidden"}`}>
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-[#101010] rounded-xl p-6 border-[1px] border-zinc-600">
        <Form method="post" className="flex flex-col gap-6">
          <input type="hidden" name="intent" value="updateProfileData" />
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-white">Edit profile</h2>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-white"
            >
              ✕
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-white mb-2">Display name</h3>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Write bio"
                  className="bg-zinc-900 text-white p-2 rounded-lg w-full"
                  defaultValue={user?.displayName}
                  name="displayName"
                />
              </div>
            </div>{" "}
            <div>
              <h3 className="text-white mb-2">Bio</h3>
              <input
                type="text"
                placeholder="Write bio"
                className="bg-zinc-900 text-white p-2 rounded-lg w-full"
                defaultValue={user?.bio}
                name="bio"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 text-md font-semibold bg-white text-black rounded-lg mt-4"
          >
            Done
          </button>
        </Form>
      </div>
    </div>
  );
};

const UploadImageModal = ({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}) => {
  const formRef = useRef<HTMLFormElement>(null);
  const [uploadedImgUrl, setUploadedImgUrl] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const uploadThingBtnRef = useRef<HTMLDivElement>(null);

  const actionData = useActionData() as ActionReturnType;
  useEffect(() => {
    toastActionData(actionData, "updateProfileImage");
    if (actionData?.success) {
      setIsOpen(false);
    }
  }, [actionData]);
  return (
    <div className={`fixed inset-0 bg-black/85 z-50 ${isOpen ? "" : "hidden"}`}>
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-[#181818] rounded-xl p-6 border-[0.8px] border-zinc-700">
        <Form ref={formRef} method="post" className="flex flex-col gap-6">
          <input type="hidden" name="intent" value="updateProfileImage" />
          <input type="hidden" name="profileImageUrl" value={uploadedImgUrl} />

          <div className="flex justify-between items-center border-b border-zinc-800 pb-4">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-zinc-300"
            >
              Cancel
            </button>
            <h2 className="text-white font-semibold">Upload profile picture</h2>
            <div className="w-20"></div>
          </div>

          {uploadedImgUrl && (
            <div className="flex justify-center">
              <img
                src={uploadedImgUrl}
                alt="Profile preview"
                className="w-32 h-32 rounded-full object-cover"
              />
            </div>
          )}

          <div className="flex flex-col items-center gap-4">
            {uploadedImgUrl ? (
              <button
                type="button"
                onClick={() => setUploadedImgUrl("")}
                className="py-2 w-auto px-8 rounded-md text-red-500 border-[1px] border-red-500 hover:bg-red-500 hover:text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
              >
                Remove
              </button>
            ) : (
              <button
                type="button"
                onClick={() => uploadThingBtnRef.current?.click()}
                className="w-full py-20 px-2 rounded-md flex flex-col items-center justify-center gap-2 text-zinc-500 border border-zinc-700"
              >
                <ImageUpIcon className="w-4 h-4" />
                Upload profile picture
              </button>
            )}
            <UploadButton
              endpoint="profileImageUploader"
              onUploadBegin={() => setIsUploading(true)}
              onUploadProgress={setProgress}
              onClientUploadComplete={(res) => {
                setIsUploading(false);
                setUploadedImgUrl(res[0].url);
              }}
              onUploadError={(error: Error) => {
                setIsUploading(false);
                toast.error(`Error: ${error.message}`);
              }}
              appearance={{
                clearBtn: "hidden",
                button: "hidden",
                container: "hidden",
                allowedContent: "hidden",
              }}
              content={{
                button: () => <div ref={uploadThingBtnRef}></div>,
              }}
            />

            {isUploading && (
              <div className="flex flex-col gap-1">
                <span className="text-zinc-500 text-center">
                  Uploading... {progress}%
                </span>
                <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-white transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={!uploadedImgUrl || isUploading}
            onClick={() => {
              formRef.current?.submit();
              setIsOpen(false);
            }}
            className="w-full py-2 rounded-md hover:font-bold transition-all duration-300 bg-white text-black disabled:opacity-50 disabled:cursor-not-allowed mt-4"
          >
            Save
          </button>
        </Form>
      </div>
    </div>
  );
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
              <div className="flex -space-x-2">
                <img
                  src="https://via.placeholder.com/40x40"
                  alt="Follower"
                  className="w-5 h-5 rounded-full border border-black"
                />
                <img
                  src="https://via.placeholder.com/40x40"
                  alt="Follower"
                  className="w-5 h-5 rounded-full border border-black"
                />
                <img
                  src="https://via.placeholder.com/40x40"
                  alt="Follower"
                  className="w-5 h-5 rounded-full border border-black"
                />
              </div>
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
        <UploadImageModal
          isOpen={isUploadModalOpen}
          setIsOpen={setIsUploadModalOpen}
        />
        <div className="text-center text-zinc-500 py-8">No threads yet</div>
      </div>
    </div>
  );
};

export default ProfilePage;
