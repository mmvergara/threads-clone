const Thread = () => {
  const handleThreadClick = () => {
    console.log("Thread clicked");
  };

  return (
    <div
      onClick={handleThreadClick}
      className="flex gap-4 px-6 py-4 border-[#303030] border-t-[0.5px] cursor-pointer"
    >
      <div className="flex-shrink-0">
        <img
          src="https://via.placeholder.com/40x40"
          alt="User avatar"
          className="w-10 h-10 rounded-full"
        />
      </div>

      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-white">johndoe</span>
          <span className="text-zinc-500">@johndoe</span>
          <span className="text-zinc-500">· 2h</span>
        </div>

        <div className="mt-1 text-white">
          This is a sample thread post. It could be about anything!
        </div>

        <div className="mt-3">
          <img
            src="https://via.placeholder.com/500x300"
            alt="Thread image"
            className="rounded-xl"
          />
        </div>

        <div className="flex gap-4 mt-3 text-zinc-500">
          <button
            onClick={(e) => e.stopPropagation()}
            className="p-2 rounded-full hover:bg-zinc-800 hover:text-white transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>
          <button
            onClick={(e) => e.stopPropagation()}
            className="p-2 rounded-full hover:bg-zinc-800 hover:text-white transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
            </svg>
          </button>
          <button
            onClick={(e) => e.stopPropagation()}
            className="p-2 rounded-full hover:bg-zinc-800 hover:text-white transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M17 1l4 4-4 4" />
              <path d="M3 11V9a4 4 0 0 1 4-4h14" />
              <path d="M7 23l-4-4 4-4" />
              <path d="M21 13v2a4 4 0 0 1-4 4H3" />
            </svg>
          </button>
          <button
            onClick={(e) => e.stopPropagation()}
            className="p-2 rounded-full hover:bg-zinc-800 hover:text-white transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>

        {/* Thread Stats */}
        <div className="mt-2 text-sm text-zinc-500">
          <span>247 replies</span>
          <span className="mx-1">·</span>
          <span>1,024 likes</span>
        </div>
      </div>
    </div>
  );
};

export default Thread;
