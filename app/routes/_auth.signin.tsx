import {
  Form,
  Link,
  MetaFunction,
  useActionData,
  useNavigation,
  useSearchParams,
} from "@remix-run/react";
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import { z } from "zod";
import bcrypt from "bcrypt";
import {
  getUserIdFromSession,
  storeUserInSession,
} from "~/.server/services/session";
import { getUserByEmail, getUserById } from "~/.server/services/user";
import { handleServerError } from "~/.server/utils/error-handler";
import { useToastAction } from "~/hooks/useToastAction";

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
    throw redirect("/");
  }
  return null;
};

const signInSchema = z.object({
  email: z
    .string({ message: "Email is required" })
    .email("Please enter a valid email"),
  password: z
    .string({ message: "Password is required" })
    .min(8, "Password must be 8 or more characters"),
});

export const action = async ({ request }: ActionFunctionArgs) => {
  try {
    const formData = await request.formData();
    const valid = signInSchema.parse({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    const user = await getUserByEmail(valid.email);
    if (!user) {
      throw new Error("Invalid Credentials");
    }

    const validPassword = await bcrypt.compare(
      valid.password,
      user.passwordHash
    );
    if (!validPassword) {
      throw new Error("Invalid Credentials");
    }

    const sessionHeader = await storeUserInSession(user.id);
    return redirect("/", {
      headers: {
        "Set-Cookie": sessionHeader,
      },
    });
  } catch (error) {
    return handleServerError(error);
  }
};

const ThreadsSignIn = () => {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const justSignedUp = useSearchParams()[0].get("justSignedUp");
  useToastAction(actionData);
  return (
    <main
      className="min-h-screen bg-[#101010] text-white flex items-center justify-center px-4"
      role="main"
    >
      <div className="w-full max-w-sm rounded-lg shadow-lg p-6">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold tracking-tight text-white">
            Threads
          </h1>
          <p className="text-zinc-400 mt-2" aria-label="Description">
            Not really, this is just a clone.
          </p>
          {justSignedUp && (
            <p className="text-green-500">Account Created Successfully!</p>
          )}
        </header>

        <section aria-label="Sign in form">
          <Form method="post" className="space-y-2">
            <fieldset>
              <legend className="sr-only">Sign in credentials</legend>

              <div className="mb-4">
                <label htmlFor="email" className="sr-only">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="Email"
                  required
                  aria-required="true"
                  autoComplete="email"
                  className="w-full text-sm p-4 bg-[#1E1E1E] rounded-xl focus:outline-none focus:ring-[1px] focus:ring-zinc-500 text-white placeholder-gray-400"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  name="password"
                  placeholder="Password"
                  required
                  aria-required="true"
                  autoComplete="current-password"
                  className="w-full text-sm p-4 bg-[#1E1E1E] rounded-xl focus:outline-none focus:ring-[1px] focus:ring-zinc-500 text-white placeholder-gray-400"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-white text-black font-semibold rounded-xl hover:bg-blue-500 transition duration-300"
                aria-label="Sign in"
              >
                {isSubmitting ? "Signing in..." : "Sign in"}
              </button>
            </fieldset>
          </Form>
        </section>

        <footer className="text-center mt-6 space-y-4">
          <div className="flex items-center justify-center mt-4">
            <span className="text-gray-500">{`Don't have an account?`}</span>
            <Link
              to="/signup"
              className="ml-2 text-blue-500 hover:underline"
              aria-label="Go to sign up page"
            >
              Sign up
            </Link>
          </div>
        </footer>
      </div>
    </main>
  );
};

export default ThreadsSignIn;
