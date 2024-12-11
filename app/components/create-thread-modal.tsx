import { ImageUpIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { UploadButton } from "~/utils/uploadthing";
import { Form } from "@remix-run/react";
import { Thread, User } from "~/.server/db/schema";
import { truncateTextEllipses } from "~/utils/formatters";
import { toastActionData } from "~/utils/toast";
import SubmitBtn from "./submit-btn";
import { Intent, useUniversalActionData } from "~/utils/client-action-utils";

type Props = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  parentThread?: {
    thread: Thread;
    user: User;
  };
};

const CreateThreadModal = ({ isOpen, setIsOpen, parentThread }: Props) => {
  const uploadThingBtnRef = useRef<HTMLDivElement>(null);
  const [images, setImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const actionData = useUniversalActionData();
  useEffect(() => {
    if (!isOpen) return;
    toastActionData(actionData, Intent.CreateThread);
    if (actionData?.success && actionData?.intent === Intent.CreateThread) {
      setIsOpen(false);
    }
  }, [actionData]);

  if (!isOpen) return null;
  return (
    <div
      className="fixed inset-0 bg-black/85 flex items-start justify-center p-4 pt-[10vh] overflow-y-auto z-50"
      role="dialog"
      aria-labelledby="modal-title"
      aria-modal="true"
    >
      <div className="w-full max-w-xl bg-[#181818] border-[0.8px] border-zinc-700 rounded-3xl my-8">
        <header className="flex items-center justify-between p-6 py-4 text-base border-b border-zinc-800">
          <button
            onClick={() => setIsOpen(false)}
            className="text-white hover:text-zinc-300"
            aria-label="Close modal"
          >
            Cancel
          </button>
          <h1 id="modal-title" className="text-white font-semibold">
            {parentThread ? "Reply" : "New thread"}
          </h1>
          <div className="w-20" aria-hidden="true"></div>
        </header>

        {parentThread && (
          <section className="flex gap-2 p-4" aria-labelledby="parent-thread">
            <div className="flex flex-col items-center">
              <img
                src={parentThread.user.profileImageUrl}
                alt={`${parentThread.user.displayName}'s avatar`}
                className="min-w-10 max-w-10 min-h-10 max-h-10 rounded-full"
              />
              <div className="w-0.5 grow mt-2 bg-zinc-800" aria-hidden="true" />
            </div>
            <div className="flex flex-col">
              <span id="parent-thread" className="text-white font-semibold">
                {parentThread.user.displayName}
              </span>
              <span className="text-zinc-500">
                {truncateTextEllipses(parentThread.thread.content, 200)}
              </span>
            </div>
          </section>
        )}

        <Form method="post" className="contents">
          <input type="hidden" name="images" value={JSON.stringify(images)} />
          {parentThread && (
            <input
              type="hidden"
              name="parentThreadId"
              value={parentThread.thread.id}
            />
          )}
          <article className="p-4">
            <div className="flex gap-3">
              <div className="flex flex-col items-center">
                <img
                  src="https://via.placeholder.com/40x40"
                  alt="User avatar"
                  className="w-10 h-10 rounded-full"
                />
                <div
                  className="w-0.5 grow mt-2 bg-zinc-800"
                  aria-hidden="true"
                />
              </div>

              <div className="flex-1">
                <div className="text-white font-semibold">itscrownie</div>
                <textarea
                  name="content"
                  placeholder="What's new?"
                  className="w-full flex-1 bg-transparent text-white placeholder-zinc-500 mt-2 resize-none focus:outline-none text-sm mb-2"
                  rows={1}
                  style={{ height: "auto" }}
                  onInput={(e) => {
                    const target = e.target as HTMLTextAreaElement;
                    target.style.height = "auto";
                    target.style.height = `${target.scrollHeight}px`;
                  }}
                  aria-label="Thread content"
                />

                {images.length > 0 && (
                  <div
                    className="flex flex-wrap gap-2 mb-3"
                    aria-label="Uploaded images"
                  >
                    {images.map((image, index) => (
                      <div
                        key={index}
                        className="relative group border-2 rounded-xl border-zinc-700"
                      >
                        <img
                          src={image}
                          alt={`Upload ${index + 1}`}
                          className="w-[150px] h-[150px] object-cover rounded-md"
                        />
                      </div>
                    ))}
                  </div>
                )}

                <button
                  type="button"
                  className="p-2.5 group rounded-md hover:bg-zinc-800 transition-colors"
                  onClick={() => {
                    uploadThingBtnRef.current?.click();
                  }}
                  aria-label="Upload images"
                >
                  <span className="flex items-center gap-1">
                    <ImageUpIcon
                      size={16}
                      className="text-zinc-500 group-hover:text-white bg-gra"
                    />
                    {isUploading && (
                      <div className="flex flex-col gap-1 pl-2">
                        <span className="text-zinc-500">
                          Uploading... {progress}%
                        </span>
                        <div className="w-[100px] h-1 bg-zinc-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-white transition-all duration-300"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </span>
                  <UploadButton
                    className="ut-label:hidden"
                    endpoint="threadImageUploader"
                    onUploadBegin={() => setIsUploading(true)}
                    onUploadProgress={setProgress}
                    onClientUploadComplete={(images: any) => {
                      setIsUploading(false);
                      setImages(images.map((i: any) => i.url));
                    }}
                    onUploadError={(error: Error) => {
                      setIsUploading(false);
                      toast.error(error.message);
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
                </button>
              </div>
            </div>

            <div className="flex gap-3 mt-4 pl-3">
              <img
                src="https://via.placeholder.com/40x40"
                alt="User avatar"
                className="w-4 h-4 rounded-full"
              />
              <button
                className="text-zinc-500 text-sm hover:cursor-not-allowed"
                aria-disabled="true"
              >
                Add to thread
              </button>
            </div>
          </article>

          <footer className="p-6 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-zinc-500 text-sm">
                Anyone can reply & quote
              </span>
              <SubmitBtn
                intent={Intent.CreateThread}
                className="px-4 py-2 rounded-full bg-white text-black"
                disabled={isUploading}
                aria-disabled={isUploading}
              >
                Post
              </SubmitBtn>
            </div>
          </footer>
        </Form>
      </div>
    </div>
  );
};

export default CreateThreadModal;
