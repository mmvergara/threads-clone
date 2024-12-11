import { useState } from "react";

const ProfileRepliesPage = () => {
  const [isThreadModalOpen, setIsThreadModalOpen] = useState(false);

  return (
    <>
      <div className="flex flex-col gap-4 mt-4">
        <div className="text-center text-zinc-500 py-8">Profile replies</div>
      </div>
    </>
  );
};

export default ProfileRepliesPage;
