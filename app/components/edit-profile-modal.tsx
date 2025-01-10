import { useFetcher } from "@remix-run/react";
import { useEffect } from "react";
import { User } from "~/.server/db/schema";

const EditProfileModal = ({
  isOpen,
  setIsOpen,
  user,
}: {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  user: User;
}) => {
  const editProfileDataFetcher = useFetcher();

  useEffect(() => {
    setIsOpen(false);
  }, [editProfileDataFetcher]);
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className={`fixed inset-0 bg-black/80 z-50 ${isOpen ? "" : "hidden"}`}
    >
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-[#101010] rounded-xl p-6 border-[1px] border-zinc-600">
        <editProfileDataFetcher.Form
          method="post"
          className="flex flex-col gap-6"
          action="/api/user/update-profile-data"
        >
          <header className="flex justify-between items-center">
            <h1 id="modal-title" className="text-xl font-bold text-white">
              Edit profile
            </h1>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-white"
              aria-label="Close modal"
            >
              <span aria-hidden="true">✕</span>
            </button>
          </header>

          <main className="space-y-6">
            <fieldset>
              <div>
                <label htmlFor="displayName" className="text-white mb-2 block">
                  Display name
                </label>
                <div className="flex items-center gap-2">
                  <input
                    id="displayName"
                    type="text"
                    placeholder="Enter display name"
                    className="bg-zinc-900 text-white p-2 rounded-lg w-full"
                    defaultValue={user?.displayName}
                    name="displayName"
                    aria-required="true"
                    autoComplete="name"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="bio" className="text-white mb-2 block">
                  Bio
                </label>
                <input
                  id="bio"
                  type="text"
                  placeholder="Write bio"
                  className="bg-zinc-900 text-white p-2 rounded-lg w-full"
                  defaultValue={user?.bio}
                  name="bio"
                  aria-required="true"
                />
              </div>
            </fieldset>
          </main>

          <footer>
            <button
              type="submit"
              className="w-full py-3 text-md font-semibold bg-white text-black rounded-lg mt-4"
            >
              Done
            </button>
          </footer>
        </editProfileDataFetcher.Form>
      </div>
    </div>
  );
};

export default EditProfileModal;
