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

const Sidebar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <aside
      className="hidden sm:flex fixed h-full flex-col z-50 justify-between w-[5rem] text-[#4d4d4d] py-4 bg-[#0a0a0a]"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="flex items-center justify-center">
        <Link
          to="/"
          aria-label="Home"
          className="flex items-center justify-center"
        >
          <AtSignIcon size={28} className="text-white" aria-hidden="true" />
        </Link>
      </div>

      <nav className="flex-1 flex flex-col gap-4 items-center justify-center">
        <Link
          to="/"
          className="hover:bg-[#171717] py-2.5 px-4 rounded-lg"
          aria-label="Go to home page"
        >
          <HomeIcon size={28} aria-hidden="true" />
        </Link>
        <Link
          to="/search"
          className="hover:bg-[#171717] py-2.5 px-4 rounded-lg"
          aria-label="Search"
        >
          <SearchIcon size={28} aria-hidden="true" />
        </Link>
        <button
          className="bg-[#171717] hover:text-white py-2.5 px-4 rounded-lg"
          aria-label="Create new post"
        >
          <PlusIcon size={28} aria-hidden="true" />
        </button>
        <Link
          to="/following"
          className="hover:bg-[#171717] py-2.5 px-4 rounded-lg"
          aria-label="View following"
        >
          <HeartIcon size={28} aria-hidden="true" />
        </Link>
        <Link
          to="/profile"
          className="hover:bg-[#171717] py-2.5 px-4 rounded-lg"
          aria-label="Go to profile"
        >
          <User2Icon size={28} aria-hidden="true" />
        </Link>
      </nav>

      <div className="flex flex-col gap-8 items-center justify-center pb-5 relative">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="hover:bg-[#171717] p-2.5 rounded-lg"
          aria-label="Open menu"
          aria-expanded={isDropdownOpen}
          aria-controls="dropdown-menu"
        >
          <AlignLeftIcon size={28} aria-hidden="true" />
        </button>

        {isDropdownOpen && (
          <div
            id="dropdown-menu"
            className="absolute bottom-16 left-16 z-10 w-48 bg-[#171717] rounded-xl border-[1px] border-[#303030] shadow-lg"
            role="menu"
          >
            <div className="p-2 text-red-500">
              <Link
                to="/api/logout"
                className="w-full flex gap-2 items-center p-4 hover:bg-[#252525] rounded-lg"
                onClick={() => {
                  setIsDropdownOpen(false);
                }}
                role="menuitem"
                aria-label="Logout"
              >
                <LogInIcon size={24} aria-hidden="true" />
                <span>Logout</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
