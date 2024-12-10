import { ImageUpIcon } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "react-toastify";
import { UploadButton } from "~/utils/uploadthing";
import { Form } from "@remix-run/react";

type Props = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

const CreateThreadModal = ({ isOpen, setIsOpen }: Props) => {
  const uploadThingBtnRef = useRef<HTMLDivElement>(null);
  const [images, setImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);

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
        <Form method="post" className="contents">
          <input type="hidden" name="intent" value="createThread" />
          <input type="hidden" name="images" value={JSON.stringify(images)} />
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
                  name="content"
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

                {images.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
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
              <button className="text-zinc-500 text-sm hover:cursor-not-allowed ">
                Add to thread
              </button>
            </div>
          </div>

          <div className="p-6 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-zinc-500 text-sm">
                Anyone can reply & quote
              </span>
              <button
                type="submit"
                className="px-4 py-2 rounded-full bg-white text-black"
                disabled={isUploading}
              >
                Post
              </button>
            </div>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default CreateThreadModal;
