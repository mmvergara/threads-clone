import { ImageIcon } from "lucide-react";

type Props = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};
const CreateThreadModal = ({ isOpen, setIsOpen }: Props) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/85 flex items-start justify-center p-4 pt-[10vh] overflow-y-auto z-50">
      <div className="w-full max-w-xl bg-[#181818] border-[0.8px] border-zinc-700 rounded-3xl my-8">
        <div className="flex items-center justify-between p-6 py-4 text-base border-b  border-zinc-800">
          <button
            onClick={() => setIsOpen(false)}
            className="text-white hover:text-zinc-300"
          >
            Cancel
          </button>
          <h1 className="text-white font-semibold">New thread</h1>
          <div className="w-20"></div>
        </div>
        <div className="p-4">
          <div className="flex gap-3">
            <div className="flex flex-col items-center">
              <img
                src="https://via.placeholder.com/40x40"
                alt="User avatar"
                className="w-10 h-10 rounded-full"
              />
              <div className="w-0.5 grow mt-2 bg-zinc-800" />
            </div>

            <div className="flex-1">
              <div className="text-white font-semibold">itscrownie</div>
              <textarea
                placeholder="What's new?"
                className="w-full flex-1 bg-transparent text-white placeholder-zinc-500  mt-2 resize-none focus:outline-none text-sm mb-2"
                rows={1}
                style={{ height: "auto" }}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = "auto";
                  target.style.height = `${target.scrollHeight}px`;
                }}
              />
              <button className="text-zinc-500 hover:text-white">
                <ImageIcon size={20} />
              </button>
            </div>
          </div>

          <div className="flex gap-3 mt-4 pl-3">
            <img
              src="https://via.placeholder.com/40x40"
              alt="User avatar"
              className="w-4 h-4 rounded-full"
            />
            <button className="text-zinc-500 text-sm hover:cursor-not-allowed ">
              Add to thread
            </button>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="p-6 pt-2">
          <div className="flex items-center justify-between">
            <span className="text-zinc-500 text-sm">
              Anyone can reply & quote
            </span>
            <button className="px-4 py-2 rounded-full bg-white text-black">
              Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateThreadModal;
