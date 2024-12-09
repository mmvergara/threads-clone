import { useState } from "react";
import { ImageIcon, AtSignIcon, MapPinIcon, ListIcon } from "lucide-react";

const CreateThreadButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState("");

  return (
    <>
      {/* Create Thread Button */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-zinc-800">
        <img
          src="https://via.placeholder.com/40x40"
          alt="User avatar"
          className="w-10 h-10 rounded-full"
        />
        <button
          onClick={() => setIsOpen(true)}
          className="flex-1 text-left text-zinc-500 text-lg"
        >
          What's new?
        </button>
        <button
          onClick={() => setIsOpen(true)}
          className={`px-4 py-2 rounded-full bg-zinc-800 text-zinc-500`}
        >
          Post
        </button>
      </div>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/95 flex items-start justify-center pt-5 z-50">
          <div className="w-full max-w-xl bg-black min-h-[300px]">
            <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-800">
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:text-zinc-300"
              >
                Cancel
              </button>
              <h1 className="text-white font-semibold">New thread</h1>
              <div className="w-12 h-8 flex items-center justify-center">
                <img
                  src="/images/threads-app-icon.png"
                  alt="Threads icon"
                  className="w-6 h-6"
                />
              </div>
            </div>

            {/* Thread Content */}
            <div className="p-4">
              <div className="flex gap-3">
                {/* User Avatar */}
                <div className="flex flex-col items-center">
                  <img
                    src="https://via.placeholder.com/40x40"
                    alt="User avatar"
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="w-0.5 grow mt-2 bg-zinc-800" />
                </div>

                {/* Input Area */}
                <div className="flex-1">
                  <div className="text-white font-semibold">itscrownie</div>
                  <textarea
                    placeholder="What's new?"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full bg-transparent text-white placeholder-zinc-500 text-lg mt-2 resize-none focus:outline-none"
                    rows={4}
                  />
                </div>
              </div>

              {/* Add to thread placeholder */}
              <div className="flex gap-3 mt-4">
                <div className="w-10" /> {/* Spacing to align with avatar */}
                <button className="text-zinc-500 text-sm">Add to thread</button>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="absolute bottom-0 left-0 right-0 border-t border-zinc-800 p-4">
              <div className="flex items-center justify-between">
                <div className="flex gap-4">
                  <button className="text-zinc-500 hover:text-white">
                    <ImageIcon size={20} />
                  </button>
                  <button className="text-zinc-500 hover:text-white">
                    <AtSignIcon size={20} />
                  </button>
                  <button className="text-zinc-500 hover:text-white">
                    <MapPinIcon size={20} />
                  </button>
                  <button className="text-zinc-500 hover:text-white">
                    <ListIcon size={20} />
                  </button>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-zinc-500 text-sm">
                    Anyone can reply & quote
                  </span>
                  <button
                    className={`px-4 py-2 rounded-full ${
                      content.length > 0
                        ? "bg-white text-black"
                        : "bg-zinc-800 text-zinc-500"
                    }`}
                    disabled={content.length === 0}
                  >
                    Post
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CreateThreadButton;
