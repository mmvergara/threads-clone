import { Form, Link, MetaFunction, useActionData } from "@remix-run/react";
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import { z } from "zod";
import {
  ActionReturnType,
  handleActionError,
  handleCatchErrorAction,
} from "~/.server/utils/action-utils";
import bcrypt from "bcrypt";
import {
  getUserIdFromSession,
  storeUserInSession,
} from "~/.server/session/session";
import { getUserByEmail, getUserById } from "~/.server/services/user";
import { useEffect } from "react";
import { toastActionData } from "~/utils/toast";

export const meta: MetaFunction = () => {
  return [
    { title: "Sign In" },
    {
      name: "description",
      content: "Sign in to your account",
    },
  ];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userId = await getUserIdFromSession(request);
  if (!userId) return null;
  const user = await getUserById(userId);
  if (user) {
    return redirect("/");
  }
  return null;
};

const signInSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(8, "Password must be 8 or more characters"),
});

export const action = async ({ request }: ActionFunctionArgs) => {
  try {
    const formData = await request.formData();
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const valid = await signInSchema.parseAsync({ email, password });

    const user = await getUserByEmail(valid.email);
    if (!user) return handleActionError(["Invalid Credentials"], "signIn");

    const validPassword = await bcrypt.compare(password, user.passwordHash);
    if (!validPassword)
      return handleActionError(["Invalid Credentials"], "signIn");

    const sessionHeader = await storeUserInSession(user.id);
    return redirect("/", {
      headers: {
        "Set-Cookie": sessionHeader,
      },
    });
  } catch (error) {
    return handleCatchErrorAction(error, "signIn");
  }
};

const ThreadsSignIn = () => {
  const actionData = useActionData() as ActionReturnType;
  useEffect(() => {
    toastActionData(actionData, "signIn");
  }, [actionData]);

  return (
    <div className="min-h-screen bg-[#101010] text-white flex items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-lg shadow-lg p-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold tracking-tight text-white">
            Threads
          </h1>
          <p className="text-zinc-400 mt-2">
            Not really, this is just a clone.
          </p>
        </div>
        <Form method="post" className="space-y-2">
          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            className="w-full text-sm p-4 bg-[#1E1E1E] rounded-xl focus:outline-none focus:ring-[1px] focus:ring-zinc-500 text-white placeholder-gray-400"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            className="w-full text-sm p-4 bg-[#1E1E1E] rounded-xl focus:outline-none focus:ring-[1px] focus:ring-zinc-500 text-white placeholder-gray-400"
          />
          <button
            type="submit"
            className="w-full py-3 bg-white text-black font-semibold rounded-xl hover:bg-blue-500 transition duration-300"
          >
            Log In
          </button>
        </Form>
        <div className="text-center mt-6 space-y-4">
          <a href="#" className="text-zinc-500 text-sm hover:underline">
            Forgot password?
          </a>
          <div className="flex items-center justify-center mt-4">
            <span className="text-gray-500">Don't have an account?</span>
            <Link to="/signup" className="ml-2 text-blue-500 hover:underline">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThreadsSignIn;
