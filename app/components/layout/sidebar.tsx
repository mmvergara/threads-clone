import { Link } from "@remix-run/react";
import {
  AlignLeftIcon,
  AtSignIcon,
  HeartIcon,
  HomeIcon,
  PinIcon,
  PlusIcon,
  SearchIcon,
  User2Icon,
} from "lucide-react";

const Sidebar = () => {
  return (
    <div className="hidden sm:flex fixed h-full flex-col z-50 justify-between w-[5rem] text-[#4d4d4d] py-4 bg-[#0a0a0a] ">
      <div className="flex items-center justify-center">
        <AtSignIcon size={28} className="text-white" />
      </div>
      <div className="flex-1 flex flex-col gap-4 items-center justify-center">
        <Link to="/" className="hover:bg-[#171717] py-2.5 px-4 rounded-lg">
          <HomeIcon size={28} />
        </Link>
        <Link to="/" className="hover:bg-[#171717] py-2.5 px-4 rounded-lg">
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
      <div className="flex flex-col gap-8 items-center justify-center pb-5">
        <PinIcon size={28} />
        <AlignLeftIcon size={28} />
      </div>
    </div>
  );
};

export default Sidebar;
