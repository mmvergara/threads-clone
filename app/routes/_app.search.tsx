import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
import { SearchIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { getThreads, searchThreads } from "~/.server/services/threads";
import { requireUser } from "~/.server/services/session";
import Thread from "~/components/thread/thread";

// TODO: Implement Granular Error Handling
export const loader = async ({ request }: LoaderFunctionArgs) => {
  const currentUser = await requireUser(request);
  const url = new URL(request.url);
  const searchQuery = url.searchParams.get("q") || "";
  if (!searchQuery) {
    const threads = await getThreads({ currentUserId: currentUser.id });
    return {
      threads,
      currentUser,
    };
  }
  const threads = await searchThreads({
    currentUserId: currentUser.id,
    searchQuery: searchQuery,
  });
  return {
    threads,
    currentUser,
  };
};

const SearchPage = () => {
  const { threads, currentUser } = useLoaderData<typeof loader>();
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    navigate(`/search?q=${search}`);
  }, [search]);

  return (
    <main className="flex flex-col w-full" role="main">
      <header className="flex flex-col w-full" role="banner">
        <h1 className="sr-only">Search Threads</h1>
        <form
          role="search"
          className="flex items-center gap-3 m-6 p-3 px-6 bg-[#0a0a0a] mb-4.5 rounded-2xl border-[1px] border-zinc-800 text-white"
        >
          <SearchIcon size={16} className="text-zinc-500" aria-hidden="true" />
          <label htmlFor="search-input" className="sr-only">
            Search threads
          </label>
          <input
            id="search-input"
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent outline-none"
            placeholder="Search"
            autoComplete="off"
            aria-label="Search threads"
          />
        </form>
      </header>

      <section aria-label="Search results" className="flex flex-col w-full">
        {threads.length === 0 ? (
          <p className="text-center text-zinc-500 p-4">No threads found</p>
        ) : (
          <ul className="flex flex-col w-full" role="list">
            {threads.map((thread) => (
              <li key={thread.thread.id}>
                <Thread
                  isReposted={false}
                  thread={thread.thread}
                  threadAuthor={thread.user}
                  currentUser={currentUser}
                  isLiked={thread.isLiked}
                  withoutActions
                />
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
};

export default SearchPage;
