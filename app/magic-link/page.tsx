'use client'

import { useAuthActions } from "@convex-dev/auth/react";
import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useConvexAuth } from "convex/react";

function MagicLinkVerification() {
  const { signIn } = useAuthActions();
  const { isAuthenticated, isLoading } = useConvexAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // If already authenticated, redirect to dashboard
    if (isAuthenticated && !isLoading) {
      router.push("/dashboard");
      return;
    }

    // Function to extract params from either hash or query string
    const getAuthParams = (): Record<string, string> | null => {
      const params: Record<string, string> = {};

      // First, try to get from hash fragment (more secure)
      if (typeof window !== 'undefined' && window.location.hash) {
        const hash = window.location.hash.substring(1); // Remove the #
        const hashParams = new URLSearchParams(hash);

        hashParams.forEach((value, key) => {
          params[key] = value;
        });

        console.log("Found params in hash:", params);
        console.log("Hash keys:", Object.keys(params));

        if (Object.keys(params).length > 0) {
          return params;
        }
      }

      // Fallback to query params
      searchParams.forEach((value, key) => {
        params[key] = value;
      });

      console.log("Found params in query:", params);
      console.log("Query keys:", Object.keys(params));

      if (Object.keys(params).length > 0) {
        return params;
      }

      return null;
    };

    const params = getAuthParams();
    const code = params?.code;
    const email = params?.email;

    console.log("Magic link page - checking for code:", {
      code,
      email,
      hasEmail: !!email,
      isVerifying,
      isAuthenticated,
      fullURL: typeof window !== 'undefined' ? window.location.href : 'N/A',
      hash: typeof window !== 'undefined' ? window.location.hash : 'N/A',
      search: typeof window !== 'undefined' ? window.location.search : 'N/A',
      searchParamsSize: searchParams.toString().length,
      allParams: params,
      paramKeys: params ? Object.keys(params) : []
    });

    if (code && !isVerifying && !isAuthenticated) {
      setIsVerifying(true);

      console.log("Verifying magic link with params:", params);
      signIn("resend-hash", params)
        .then((result) => {
          console.log("Sign-in successful, result:", result);

          // Clear the hash/params from URL for security
          if (typeof window !== 'undefined') {
            window.history.replaceState({}, document.title, window.location.pathname);
          }

          // Redirect to dashboard on success
          router.push("/dashboard");
        })
        .catch((error) => {
          console.error("Sign-in error:", error);
          setError("Failed to verify magic link. The link may have expired.");
          setIsVerifying(false);

          // Clear the hash/params from URL
          if (typeof window !== 'undefined') {
            window.history.replaceState({}, document.title, window.location.pathname);
          }
        });
    } else if (!code && !isVerifying) {
      // No code in URL, redirect to login
      setError("Invalid magic link. Please try signing in again.");
    }
  }, [searchParams, signIn, isVerifying, isAuthenticated, isLoading, router]);

  if (isVerifying || (isAuthenticated && !isLoading)) {
    return (
      <div className="min-h-screen bg-[#0f1419] flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl text-white mb-4">Verifying your magic link...</div>
          <div className="text-gray-400">Please wait</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0f1419] flex items-center justify-center">
        <div className="bg-[#1a1f25] border border-[#2d333b] rounded-xl p-8 w-full max-w-md">
          <div className="text-center">
            <div className="text-xl text-white mb-4">Verification Failed</div>
            <div className="mb-6 p-3 bg-red-900/20 border border-red-500 rounded-lg text-red-400 text-sm">
              {error}
            </div>
            <button
              onClick={() => router.push("/login")}
              className="w-full bg-[#3ecf8e] text-[#0f1419] px-6 py-3 rounded-lg font-semibold hover:bg-[#35b67a] transition-colors"
            >
              Back to Sign In
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f1419] flex items-center justify-center">
      <div className="text-center">
        <div className="text-xl text-white mb-4">Processing...</div>
      </div>
    </div>
  );
}

export default function MagicLink() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0f1419] flex items-center justify-center">
        <div className="text-xl text-white">Loading...</div>
      </div>
    }>
      <MagicLinkVerification />
    </Suspense>
  );
}
