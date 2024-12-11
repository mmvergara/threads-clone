import { Form, useActionData } from "@remix-run/react/dist/components";
import { ImageUpIcon } from "lucide-react";
import { useEffect } from "react";
import { useState } from "react";
import { useRef } from "react";
import { toast } from "react-toastify";
import { ActionReturnType } from "~/.server/utils/action-utils";
import { toastActionData } from "~/utils/toast";
import { UploadButton } from "~/utils/uploadthing";
import SubmitBtn from "./submit-btn";
import { Intent } from "~/utils/client-action-utils";
const UploadImageModal = ({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}) => {
  const formRef = useRef<HTMLFormElement>(null);
  const [uploadedImgUrl, setUploadedImgUrl] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const uploadThingBtnRef = useRef<HTMLDivElement>(null);

  const actionData = useActionData() as ActionReturnType;
  useEffect(() => {
    toastActionData(actionData, "updateProfileImage");
    if (actionData?.success) {
      setIsOpen(false);
    }
  }, [actionData]);
  return (
    <div className={`fixed inset-0 bg-black/85 z-50 ${isOpen ? "" : "hidden"}`}>
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-[#181818] rounded-xl p-6 border-[0.8px] border-zinc-700">
        <Form ref={formRef} method="post" className="flex flex-col gap-6">
          <input type="hidden" name="intent" value="updateProfileImage" />
          <input type="hidden" name="profileImageUrl" value={uploadedImgUrl} />

          <div className="flex justify-between items-center border-b border-zinc-800 pb-4">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-zinc-300"
            >
              Cancel
            </button>
            <h2 className="text-white font-semibold">Upload profile picture</h2>
            <div className="w-20"></div>
          </div>

          {uploadedImgUrl && (
            <div className="flex justify-center">
              <img
                src={uploadedImgUrl}
                alt="Profile preview"
                className="w-32 h-32 rounded-full object-cover"
              />
            </div>
          )}

          <div className="flex flex-col items-center gap-4">
            {uploadedImgUrl ? (
              <button
                type="button"
                onClick={() => setUploadedImgUrl("")}
                className="py-2 w-auto px-8 rounded-md text-red-500 border-[1px] border-red-500 hover:bg-red-500 hover:text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
              >
                Remove
              </button>
            ) : (
              <button
                type="button"
                onClick={() => uploadThingBtnRef.current?.click()}
                className="w-full py-20 px-2 rounded-md flex flex-col items-center justify-center gap-2 text-zinc-500 border border-zinc-700"
              >
                <ImageUpIcon className="w-4 h-4" />
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
              <div className="flex flex-col gap-1">
                <span className="text-zinc-500 text-center">
                  Uploading... {progress}%
                </span>
                <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-white transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          <SubmitBtn
            intent={Intent.UpdateProfileImage}
            disabled={!uploadedImgUrl || isUploading}
            onClick={() => {
              formRef.current?.submit();
              setIsOpen(false);
            }}
            className="w-full py-2 rounded-md hover:font-bold transition-all duration-300 bg-white text-black disabled:opacity-50 disabled:cursor-not-allowed mt-4"
          >
            Save
          </SubmitBtn>
        </Form>
      </div>
    </div>
  );
};

export default UploadImageModal;
