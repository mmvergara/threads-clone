import {
  Form,
  Link,
  useActionData,
  useLoaderData,
  useNavigate,
} from "@remix-run/react";
import { ActionFunctionArgs } from "@remix-run/node";
import { z } from "zod";
import {
  actionError,
  ActionReturnType,
  actionSuccess,
  handleErrorAction,
  useToastedAction,
} from "~/utils/action-utils";
import bcrypt from "bcrypt";
import { createUser, isEmailTaken, isHandleTaken } from "~/db/repo_users";
import { useEffect } from "react";

const signUpSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  handle: z
    .string()
    .min(3, "Handle must be 3 or more characters")
    .max(20, "Handle must be 20 or less characters"),
  password: z.string().min(8, "Password must be 8 or more characters"),
});

export const action = async ({
  request,
}: ActionFunctionArgs): Promise<ActionReturnType<void>> => {
  try {
    const formData = await request.formData();
    const email = formData.get("email") as string;
    const handle = formData.get("handle") as string;
    const password = formData.get("password") as string;
    const valid = await signUpSchema.parseAsync({ email, handle, password });

    const emailTaken = await isEmailTaken(valid.email);
    if (emailTaken) return actionError("Email is already taken");

    const handleTaken = await isHandleTaken(valid.handle);
    if (handleTaken) return actionError("Handle is already taken");

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    await createUser({
      email: valid.email,
      handle: valid.handle,
      passwordHash: passwordHash,
    });
    return actionSuccess("Successfully created account!");
  } catch (error) {
    console.log(error);
    return handleErrorAction(error);
  }
};

const ThreadsSignUp = () => {
  const data = useActionData<typeof action>();
  const navigate = useNavigate();
  useToastedAction(data);
  useEffect(() => {
    if (data?.success) {
      navigate("/auth/signin");
    }
  }, [data]);
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
            type="text"
            name="handle"
            max={20}
            placeholder="Handle (username)"
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
            Sign Up
          </button>
        </Form>
        <div className="text-center mt-6 space-y-4">
          <div className="flex items-center justify-center mt-4">
            <span className="text-gray-500">Already have an account?</span>
            <Link
              to="/auth/signin"
              className="ml-2 text-blue-500 hover:underline"
            >
              Log In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThreadsSignUp;
