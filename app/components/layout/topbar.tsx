import { CheckIcon } from "lucide-react";
import { Link, useLocation } from "@remix-run/react";
import { ChevronDownIcon } from "lucide-react";
import { useState } from "react";

const TopBar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const location = useLocation();
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
      name: "Search",
      href: "/search",
    },
  ];

  return (
    <header className="flex fixed w-full z-40 bg-[#0a0a0a] flex-row items-center justify-center gap-4 p-3 border-b-[1px] sm:border-none border-[#3d3d3d]">
      <nav role="navigation" aria-label="Main navigation">
        <h1 className="font-bold mb-1 ml-2">
          {links.find((link) => link.href === location.pathname)?.name}
        </h1>
        
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="bg-[#171717] p-1 rounded-full border-[1px] border-[#303030] hover:bg-[#252525]"
            aria-expanded={isDropdownOpen}
            aria-haspopup="true"
            aria-label="Navigation menu"
          >
            <ChevronDownIcon 
              size={16} 
              aria-hidden="true"
            />
          </button>

          {isDropdownOpen && (
            <div 
              className="absolute right-[-120px] mt-2 z-10 w-64 bg-[#171717] rounded-xl border-[1px] border-[#303030] shadow-lg"
              role="menu"
              aria-orientation="vertical"
            >
              <ol className="p-2 flex flex-col gap-1">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      className="flex items-center p-4 justify-between hover:bg-[#252525] rounded-lg"
                      to={link.href}
                      onClick={() => setIsDropdownOpen(false)}
                      role="menuitem"
                      aria-current={location.pathname === link.href ? "page" : undefined}
                    >
                      {link.name}
                      {location.pathname === link.href && (
                        <CheckIcon 
                          size={28} 
                          aria-hidden="true"
                          aria-label="Current page"
                        />
                      )}
                    </Link>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default TopBar;
