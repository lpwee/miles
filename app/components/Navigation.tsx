"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navigation() {
  const pathname = usePathname();

  const navItems = [
    { name: "My Cards", path: "/" },
    { name: "Add Card", path: "/add" },
    { name: "Learn", path: "/learn" },
  ];

  return (
    <nav className="bg-[#1a1f25] border-b border-[#2d333b] mb-8">
      <div className="max-w-6xl mx-auto px-8">
        <div className="flex gap-8">
          {navItems.map((item) => {
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
        </div>
      </div>
    </nav>
  );
}
