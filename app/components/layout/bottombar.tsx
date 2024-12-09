import { HeartIcon, HomeIcon, PlusIcon, SearchIcon, User2Icon } from "lucide-react";

const BottomBar = () => {
  return (
    <div className="flex sm:hidden flex-col w-full h-[70px] bg-[#0a0a0a] ">
      <div className="flex-1 flex flex-row text-[#4d4d4d] items-center ">
        <button className="flex-1 relative group h-full rounded-lg">
          <div className="absolute top-1/2 h-1 w-1 bg-black group-hover:bg-[#171717] rounded-lg group-hover:h-[85%] group-hover:w-[85%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200"></div>
          <HomeIcon
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            size={28}
          />
        </button>
        <button className="flex-1 relative group h-full rounded-lg">
          <div className="absolute top-1/2 h-1 w-1 bg-black group-hover:bg-[#171717] rounded-lg group-hover:h-[85%] group-hover:w-[85%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200"></div>
          <SearchIcon
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            size={28}
          />
        </button>
        <button className="flex-1 relative group h-full rounded-lg">
          <div className="absolute top-1/2 h-1 w-1 bg-black group-hover:bg-[#171717] rounded-lg group-hover:h-[85%] group-hover:w-[85%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200"></div>
          <PlusIcon
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            size={28}
          />
        </button>
        <button className="flex-1 relative group h-full rounded-lg">
          <div className="absolute top-1/2 h-1 w-1 bg-black group-hover:bg-[#171717] rounded-lg group-hover:h-[85%] group-hover:w-[85%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200"></div>
          <HeartIcon
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            size={28}
          />
        </button>
        <button className="flex-1 relative group h-full rounded-lg">
          <div className="absolute top-1/2 h-1 w-1 bg-black group-hover:bg-[#171717] rounded-lg group-hover:h-[85%] group-hover:w-[85%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200"></div>
          <User2Icon
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            size={28}
          />
        </button>
      </div>
    </div>
  );
};

export default BottomBar;
