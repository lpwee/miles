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
    <nav className="bg-white border-b-4 border-gray-500 mb-8">
      <div className="max-w-6xl mx-auto px-8">
        <div className="flex gap-8">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`py-4 px-6 text-xl font-semibold transition-colors ${
                  isActive
                    ? "text-green-600 border-b-4 border-green-600"
                    : "text-black hover:text-green-600"
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
