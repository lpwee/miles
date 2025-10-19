"use client";

import Navigation from "./components/Navigation";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0f1419]">
      <Navigation />
      <div className="max-w-6xl mx-auto px-8">
        <div className="text-center py-24">
          <h1 className="text-5xl font-bold mb-6 text-white">Welcome to Miles Tracker</h1>
          <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
            Track your credit card miles and rewards in one place. Maximize your benefits and never miss out on earning potential.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/login"
              className="inline-block bg-[#3ecf8e] text-[#0f1419] px-8 py-3 rounded-lg font-semibold hover:bg-[#35b67a] transition-colors"
            >
              Get Started
            </Link>
            <Link
              href="/learn"
              className="inline-block bg-[#2d333b] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#3d434b] transition-colors"
            >
              Learn More
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
