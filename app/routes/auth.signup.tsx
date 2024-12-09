import { Form, Link, useActionData, useLoaderData } from "@remix-run/react";
import { ActionFunctionArgs } from "@remix-run/node";
import { z } from "zod";
import { useEffect } from "react";

const signUpSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  username: z
    .string()
    .min(3, "Username must be 3, or more characters")
    .max(20, "Username must be 20 or less characters"),
  password: z.string().min(8, "Password must be 8 or more characters"),
});

export const action = async ({
  request,
}: ActionFunctionArgs): Promise<{
  error: string | null;
}> => {
  try {
    const formData = await request.formData();
    const email = formData.get("email") as string;
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    const res = await signUpSchema.parseAsync({ email, username, password });
    console.log("Valid data:", res);

    // Process the validated data...

    return { error: null };
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("Validation errors:", error.errors);
      return { error: error.errors[0].message };
    } else {
      console.error("Unexpected error:", error);
      return { error: "Unexpected error occurred" };
    }
  }
};

const ThreadsSignUp = () => {
  const data = useActionData<typeof action>();
  useEffect(() => {
    if (!data) return;
    if (data.error) {
      alert(data.error);
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
            name="username"
            max={20}
            placeholder="Username"
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
