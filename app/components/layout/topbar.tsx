import { CheckIcon } from "lucide-react";
import { Link } from "@remix-run/react";
import { ChevronDownIcon } from "lucide-react";
import { useState } from "react";

const TopBar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const links = [
    {
      name: "For you",
      href: "/app",
    },
    {
      name: "Following",
      href: "/app/following",
    },
    {
      name: "Liked",
      href: "/app/liked",
    },
    {
      name: "Saved",
      href: "/app/saved",
    },
  ];
  return (
    <div className="flex fixed w-full mx-auto flex-row items-center justify-center gap-4 mt-2   p-3 rounded-3xl">
      <button className="font-bold mb-1">For you</button>
      <div className="relative">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="bg-[#171717] p-1 rounded-full border-[0.5px] border-[#303030] hover:bg-[#252525]"
        >
          <ChevronDownIcon size={16} />
        </button>
        {isDropdownOpen && (
          <div className="absolute right-[-120px] mt-2 w-64 bg-[#171717] rounded-xl border-[0.5px] border-[#303030] shadow-lg">
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
