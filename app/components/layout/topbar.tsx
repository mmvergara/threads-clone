import { CheckIcon } from "lucide-react";
import { Link } from "@remix-run/react";
import { ChevronDownIcon } from "lucide-react";
import { useState } from "react";

const TopBar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const links = [
    {
      name: "For you",
      href: "/",
    },
    {
      name: "Following",
      href: "/following",
    },
    {
      name: "Liked",
      href: "/liked",
    },
    {
      name: "Saved",
      href: "/saved",
    },
  ];
  return (
    <div className="flex fixed w-full z-40 bg-[#0a0a0a] flex-row items-center justify-center gap-4 p-3 border-b-[1px] sm:border-none border-[#3d3d3d]">
      <button className="font-bold mb-1 ml-2">For you</button>
      <div className="relative">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="bg-[#171717] p-1 rounded-full border-[1px] border-[#303030] hover:bg-[#252525]"
        >
          <ChevronDownIcon size={16} />
        </button>
        {isDropdownOpen && (
          <div className="absolute right-[-120px] mt-2 z-10 w-64 bg-[#171717] rounded-xl border-[1px] border-[#303030] shadow-lg">
            <ol className="p-2 flex flex-col gap-1">
              {links.map((link) => (
                <Link
                  className="flex items-center p-4 justify-between hover:bg-[#252525] rounded-lg"
                  key={link.name}
                  to={link.href}
                  onClick={() => setIsDropdownOpen(false)}
                >
                  {link.name}
                  <CheckIcon size={28} />
                </Link>
              ))}
            </ol>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopBar;
