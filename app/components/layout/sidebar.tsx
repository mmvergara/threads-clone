import { Form, Link } from "@remix-run/react";
import {
  AlignLeftIcon,
  AtSignIcon,
  HeartIcon,
  HomeIcon,
  LogInIcon,
  PlusIcon,
  SearchIcon,
  User2Icon,
} from "lucide-react";
import { useState } from "react";
import SubmitBtn from "../submit-btn";
import { Intent } from "~/utils/client-action-utils";

const Sidebar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <div className="hidden sm:flex fixed h-full flex-col z-50 justify-between w-[5rem] text-[#4d4d4d] py-4 bg-[#0a0a0a] ">
      <div className="flex items-center justify-center">
        <AtSignIcon size={28} className="text-white" />
      </div>
      <div className="flex-1 flex flex-col gap-4 items-center justify-center">
        <Link to="/" className="hover:bg-[#171717] py-2.5 px-4 rounded-lg">
          <HomeIcon size={28} />
        </Link>
        <Link
          to="/search"
          className="hover:bg-[#171717] py-2.5 px-4 rounded-lg"
        >
          <SearchIcon size={28} />
        </Link>
        <button className="bg-[#171717] hover:text-white py-2.5 px-4 rounded-lg">
          <PlusIcon size={28} />
        </button>
        <button className="hover:bg-[#171717] py-2.5 px-4 rounded-lg">
          <HeartIcon size={28} />
        </button>
        <Link
          to="/profile"
          className="hover:bg-[#171717] py-2.5 px-4 rounded-lg"
        >
          <User2Icon size={28} />
        </Link>
      </div>{" "}
      <div className="flex flex-col gap-8 items-center justify-center pb-5 relative">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="hover:bg-[#171717] p-2.5 rounded-lg"
        >
          <AlignLeftIcon size={28} />
        </button>

        {isDropdownOpen && (
          <div className="absolute bottom-16 left-16 z-10 w-48 bg-[#171717] rounded-xl border-[1px] border-[#303030] shadow-lg">
            <div className="p-2 text-red-500">
              <Link
                to="/api/logout"
                className="w-full flex gap-2 items-center p-4 hover:bg-[#252525] rounded-lg"
                onClick={() => {
                  setIsDropdownOpen(false);
                }}
              >
                <LogInIcon size={24} />
                Logout
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
