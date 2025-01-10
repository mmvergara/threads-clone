import {
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteError,
} from "@remix-run/react";
import type { LinksFunction } from "@remix-run/node";
import { ToastContainer } from "react-toastify";
import { AlertCircle } from "lucide-react";
import "./tailwind.css";
import "react-toastify/dist/ReactToastify.css";

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ToastContainer theme="dark" />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  return (
    <html lang="en">
      <head>
        <title>Oops! Something went wrong</title>
        <Meta />
        <Links />
      </head>
      <body className="bg-[#101010] text-white">
        <main className="min-h-screen flex items-center justify-center px-4">
          <div className="w-full max-w-sm text-center space-y-6">
            <div className="flex justify-center">
              <AlertCircle className="w-16 h-16 text-red-500" />
            </div>

            <div className="space-y-2">
              <h1 className="text-4xl font-bold tracking-tight">
                Something went wrong
              </h1>
              <p className="text-zinc-400">
                {`We're sorry, but we encountered an unexpected error.`}
              </p>
            </div>

            <div className="bg-[#1E1E1E] p-4 rounded-xl text-sm text-zinc-400 text-left overflow-auto">
              <pre className="whitespace-pre-wrap">
                {error instanceof Error
                  ? error.message
                  : "An unexpected error occurred"}
              </pre>
            </div>

            <div className="pt-4">
              <Link
                to="/"
                className="inline-block w-full py-3 bg-white text-black font-semibold rounded-xl hover:bg-blue-500 transition duration-300"
              >
                Return Home
              </Link>
            </div>
          </div>
        </main>
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
