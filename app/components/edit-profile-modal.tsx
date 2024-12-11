import { Form } from "@remix-run/react";
import { useActionData } from "@remix-run/react";
import { useEffect } from "react";
import { User } from "~/.server/db/schema";
import { ActionReturnType } from "~/.server/utils/action-utils";
import { toastActionData } from "~/utils/toast";
import SubmitBtn from "./submit-btn";
import { Intent } from "~/utils/client-action-utils";

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

          <SubmitBtn
            intent={Intent.UpdateProfileData}
            className="w-full py-3 text-md font-semibold bg-white text-black rounded-lg mt-4"
          >
            Done
          </SubmitBtn>
        </Form>
      </div>
    </div>
  );
};

export default EditProfileModal;
