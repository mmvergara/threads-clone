import { useState } from "react";
import CreateThreadModal from "~/components/create-thread-modal";

const ProfilePage = () => {
  const [isThreadModalOpen, setIsThreadModalOpen] = useState(false);

  return (
    <>
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
      </div>
      <CreateThreadModal
        isOpen={isThreadModalOpen}
        setIsOpen={setIsThreadModalOpen}
      />
      <div className="text-center text-zinc-500 py-8">No threads yet</div>
    </>
  );
};

export default ProfilePage;
