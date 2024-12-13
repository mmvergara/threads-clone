import { Link } from "@remix-run/react";
import { HeartIcon, HomeIcon, PlusIcon, SearchIcon, User2Icon } from "lucide-react";

const BottomBar = () => {
  return (
    <nav 
      className="flex sm:hidden fixed bottom-0 flex-col w-full h-[70px] bg-[#171715]"
      aria-label="Main navigation"
    >
      <div className="flex-1 flex flex-row text-[#4d4d4d] items-center" role="menubar">
        <Link 
          to="/" 
          className="flex-1 relative group h-full rounded-lg"
          role="menuitem"
          aria-label="Home"
        >
          <div 
            className="absolute top-1/2 h-1 w-1 bg-black group-hover:bg-[#171717] rounded-lg group-hover:h-[85%] group-hover:w-[85%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200"
            aria-hidden="true"
          ></div>
          <HomeIcon
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            size={28}
            aria-hidden="true"
          />
        </Link>
        <Link to="/search" className="flex-1 relative group h-full rounded-lg">
          <div className="absolute top-1/2 h-1 w-1 bg-black group-hover:bg-[#171717] rounded-lg group-hover:h-[85%] group-hover:w-[85%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200"></div>
          <SearchIcon
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            size={28}
          />
        </Link>
        <button 
          className="flex-1 relative group h-full rounded-lg"
          role="menuitem"
          aria-label="Create new post"
        >
          <div 
            className="absolute top-1/2 h-1 w-1 bg-black group-hover:bg-[#171717] rounded-lg group-hover:h-[85%] group-hover:w-[85%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200"
            aria-hidden="true"
          ></div>
          <PlusIcon
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            size={28}
            aria-hidden="true"
          />
        </button>
        <Link to="/following" className="flex-1 relative group h-full rounded-lg">
          <div className="absolute top-1/2 h-1 w-1 bg-black group-hover:bg-[#171717] rounded-lg group-hover:h-[85%] group-hover:w-[85%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200"></div>
          <HeartIcon
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            size={28}
          />
        </Link>
        <Link to="/profile" className="flex-1 relative group h-full rounded-lg">
          <div className="absolute top-1/2 h-1 w-1 bg-black group-hover:bg-[#171717] rounded-lg group-hover:h-[85%] group-hover:w-[85%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200"></div>
          <User2Icon
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            size={28}
          />
        </Link>
      </div>
    </nav>
  );
};

export default BottomBar;
