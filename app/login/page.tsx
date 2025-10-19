'use client'

import { useAuthActions } from "@convex-dev/auth/react";
import { useEffect, useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import { useConvexAuth } from "convex/react";

function LogInForm() {
  const { signIn } = useAuthActions();
  const { isAuthenticated, isLoading } = useConvexAuth();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, isLoading, router]);

  return (
    <div className="min-h-screen bg-[#0f1419] flex items-center justify-center">
      <div className="bg-[#1a1f25] border border-[#2d333b] rounded-xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-white mb-6 text-center">Sign In</h1>

        {error && (
          <div className="mb-4 p-3 bg-red-900/20 border border-red-500 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-900/20 border border-green-500 rounded-lg text-green-400 text-sm">
            Check your email! We&apos;ve sent you a magic link to sign in.
          </div>
        )}

        <form
          className="space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            const form = event.currentTarget;
            const formData = new FormData(form);
            formData.append("redirectTo", "/magic-link");
            setError(null);
            setSuccess(false);
            void signIn("resend-hash", formData)
              .then(() => {
                // Clear the form after sending
                form.reset();
                setSuccess(true);
              })
              .catch((err) => {
                console.error("Error sending sign-in link:", err);
                setError("Failed to send sign-in link. Please try again.");
              });
          }}
        >
          <div>
            <input
              name="email"
              placeholder="Enter your email"
              type="email"
              required
              className="w-full px-4 py-3 bg-[#0f1419] border border-[#2d333b] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#3ecf8e] transition-colors"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[#3ecf8e] text-[#0f1419] px-6 py-3 rounded-lg font-semibold hover:bg-[#35b67a] transition-colors"
          >
            Send sign-in link
          </button>
          <p className="text-sm text-gray-400 text-center">
            We&apos;ll send you a magic link to sign in
          </p>
        </form>
      </div>
    </div>
  );
}

export default function LogIn() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0f1419] flex items-center justify-center">
        <div className="text-xl text-white">Loading...</div>
      </div>
    }>
      <LogInForm />
    </Suspense>
  );
}