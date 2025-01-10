import { Form, useFetcher } from "@remix-run/react/dist/components";
import { ImageUpIcon } from "lucide-react";
import { useEffect } from "react";
import { useState } from "react";
import { useRef } from "react";
import { toast } from "react-toastify";
import { toastActionData } from "~/utils/toast";
import { UploadButton } from "~/utils/uploadthing";
import SubmitBtn from "./submit-btn";

const UploadProfileImageModal = ({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}) => {
  const [uploadedImgUrl, setUploadedImgUrl] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const uploadThingBtnRef = useRef<HTMLDivElement>(null);

  const updateProfileImageFetcher = useFetcher();
  return (
    <div
      className={`fixed inset-0 bg-black/85 z-50 ${isOpen ? "" : "hidden"}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <main className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-[#181818] rounded-xl p-6 border-[0.8px] border-zinc-700">
        <updateProfileImageFetcher.Form
          method="post"
          action="/api/user/update-profile-image"
          className="flex flex-col gap-6"
        >
          <input
            type="hidden"
            name="profileImageUrl"
            value={uploadedImgUrl}
            aria-hidden="true"
          />

          <header className="flex justify-between items-center border-b border-zinc-800 pb-4">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-zinc-300"
              aria-label="Close modal"
            >
              Cancel
            </button>
            <h1 id="modal-title" className="text-white font-semibold">
              Upload profile picture
            </h1>
            <div className="w-20" aria-hidden="true"></div>
          </header>

          {uploadedImgUrl && (
            <section className="flex justify-center" aria-label="Image preview">
              <img
                src={uploadedImgUrl}
                alt="Profile picture preview"
                className="w-32 h-32 rounded-full object-cover"
              />
            </section>
          )}

          <section
            className="flex flex-col items-center gap-4"
            aria-label="Upload controls"
          >
            {uploadedImgUrl ? (
              <button
                type="button"
                onClick={() => setUploadedImgUrl("")}
                className="py-2 w-auto px-8 rounded-md text-red-500 border-[1px] border-red-500 hover:bg-red-500 hover:text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                aria-label="Remove uploaded image"
              >
                Remove
              </button>
            ) : (
              <button
                type="button"
                onClick={() => uploadThingBtnRef.current?.click()}
                className="w-full py-20 px-2 rounded-md flex flex-col items-center justify-center gap-2 text-zinc-500 border border-zinc-700"
                aria-label="Upload profile picture"
              >
                <ImageUpIcon className="w-4 h-4" aria-hidden="true" />
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
              <div
                className="flex flex-col gap-1"
                role="progressbar"
                aria-valuenow={progress}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <span className="text-zinc-500 text-center">
                  Uploading... {progress}%
                </span>
                <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-white transition-all duration-300"
                    style={{ width: `${progress}%` }}
                    aria-hidden="true"
                  />
                </div>
              </div>
            )}
          </section>

          <footer>
            <button
              type="submit"
              disabled={!uploadedImgUrl || isUploading}
              className="w-full py-2 rounded-md hover:font-bold transition-all duration-300 bg-white text-black disabled:opacity-50 disabled:cursor-not-allowed mt-4"
              aria-label="Save profile picture"
            >
              Save
            </button>
          </footer>
        </updateProfileImageFetcher.Form>
      </main>
    </div>
  );
};

export default UploadProfileImageModal;
