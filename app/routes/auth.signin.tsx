import { useState } from "react";
import { Form } from "@remix-run/react";
import { AtSign, Lock, Eye, EyeOff } from "lucide-react";

const ThreadsSignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen bg-[#101010] text-white flex items-center justify-center px-4">
      <div className="w-full max-w-sm  rounded-lg shadow-lg p-6">
        {/* Threads-like logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold tracking-tight text-white">
            Threads
          </h1>
          <p className="text-zinc-400 mt-2">
            Not really, this is just a clone.
          </p>
        </div>

        {/* Sign In Form */}
        <Form method="post" className="space-y-2">
          {/* Email Input */}
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email or username"
            required
            className="w-full text-sm p-4 bg-[#1E1E1E]  rounded-xl
                         focus:outline-none focus:ring-[1px] focus:ring-zinc-500 text-white placeholder-gray-400"
          />

          {/* Password Input */}
          <div className="relative">
            <input
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              className="w-full text-sm p-4 bg-[#1E1E1E]  rounded-xl
                         focus:outline-none focus:ring-[1px] focus:ring-zinc-500 text-white placeholder-gray-400"
            />
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            className="w-full py-3 bg-white text-black font-semibold rounded-xl
                       hover:bg-blue-500 transition duration-300"
          >
            Log In
          </button>
        </Form>

        {/* Additional Options */}
        <div className="text-center mt-6 space-y-4">
          <a href="#" className="text-zinc-500 text-sm hover:underline">
            Forgot password?
          </a>

          <div className="flex items-center justify-center mt-4">
            <span className="text-gray-500">Don't have an account?</span>
            <a href="/auth/signup" className="ml-2 text-blue-500 hover:underline">
              Sign up
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThreadsSignIn;
