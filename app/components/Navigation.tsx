"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthActions } from "@convex-dev/auth/react";
import { Authenticated, Unauthenticated } from "convex/react";

export default function Navigation() {
  const pathname = usePathname();
  const { signOut } = useAuthActions();

  const authenticatedNavItems = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Transactions", path: "/transactions" },
    { name: "Add Card", path: "/add" },
    { name: "Learn", path: "/learn" },
  ];

  const publicNavItems = [
    { name: "Home", path: "/" },
    { name: "Learn", path: "/learn" },
  ];

  return (
    <nav className="bg-[#1a1f25] border-b border-[#2d333b] mb-8">
      <div className="max-w-6xl mx-auto px-8">
        <div className="flex justify-between items-center">
          <div className="flex gap-8">
            <Authenticated>
              {authenticatedNavItems.map((item) => {
                const isActive = pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={`py-4 px-6 text-lg font-medium transition-colors ${
                      isActive
                        ? "text-[#3ecf8e] border-b-2 border-[#3ecf8e]"
                        : "text-gray-400 hover:text-[#3ecf8e]"
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </Authenticated>
            <Unauthenticated>
              {publicNavItems.map((item) => {
                const isActive = pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={`py-4 px-6 text-lg font-medium transition-colors ${
                      isActive
                        ? "text-[#3ecf8e] border-b-2 border-[#3ecf8e]"
                        : "text-gray-400 hover:text-[#3ecf8e]"
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </Unauthenticated>
          </div>

          <div className="flex items-center gap-4">
            <Authenticated>
              <button
                onClick={() => void signOut()}
                className="py-2 px-4 text-sm font-medium text-gray-400 hover:text-white transition-colors"
              >
                Sign Out
              </button>
            </Authenticated>
            <Unauthenticated>
              <Link
                href="/login"
                className="py-2 px-4 text-sm font-medium text-gray-400 hover:text-[#3ecf8e] transition-colors"
              >
                Sign In
              </Link>
            </Unauthenticated>
          </div>
        </div>
      </div>
    </nav>
  );
}
