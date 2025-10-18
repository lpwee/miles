"use client";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import Image from "next/image";
import Navigation from "../components/Navigation";

export default function Learn() {
  const cards = useQuery(api.supportedCards.get);

  return (
    <div className="min-h-screen bg-[#0f1419]">
      <Navigation />
      <div className="max-w-6xl mx-auto px-8">
        <h1 className="text-5xl font-bold mb-8 text-white">Learn</h1>
        <p className="text-lg text-gray-400 mb-8">
          Explore all available credit cards and their rewards programs
        </p>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {cards?.map((card, index) => (
            <div
              key={index}
              className="border border-[#2d333b] rounded-xl p-6 bg-[#1a1f25] hover:border-[#3ecf8e] transition-colors"
            >
              {/* Card Image */}
              <div className="w-full h-40 relative mb-4 bg-[#2d333b] rounded flex items-center justify-center">
                {card.imageUrl ? (
                  <Image
                    src={card.imageUrl}
                    alt={card.name}
                    fill
                    className="object-contain"
                  />
                ) : (
                  <span className="text-gray-500 text-6xl">📷</span>
                )}
              </div>

              {/* Card Name */}
              <h2 className="text-2xl font-bold text-white mb-4">
                {card.name}
              </h2>

              {/* Stats */}
              <div className="space-y-3 text-white">
                <div className="flex justify-between text-base">
                  <span className="font-medium text-gray-400">Miles per Dollar:</span>
                  <span className="text-[#3ecf8e] font-semibold">{card.milesPerDollar}x</span>
                </div>
                <div className="flex justify-between text-base">
                  <span className="font-medium text-gray-400">Monthly Reward Cap:</span>
                  <span>{card.monthlyRewardCap.toLocaleString()} miles</span>
                </div>
                <div className="flex justify-between text-base">
                  <span className="font-medium text-gray-400">Spending Limit:</span>
                  <span>${card.spendingLimit.toLocaleString()}</span>
                </div>
              </div>

              {/* Notes Section */}
              {card.notes && (
                <div className="mt-4 pt-4 border-t border-[#2d333b]">
                  <p className="text-sm font-medium text-gray-400 mb-1">About:</p>
                  <p className="text-sm text-gray-300">{card.notes}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {(!cards || cards.length === 0) && (
          <div className="text-center py-12">
            <p className="text-xl text-gray-400">
              No supported cards available at the moment.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
