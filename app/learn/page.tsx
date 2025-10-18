"use client";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import Image from "next/image";
import Navigation from "../components/Navigation";

export default function Learn() {
  const cards = useQuery(api.cards.get);

  return (
    <div className="min-h-screen bg-[#0f1419]">
      <Navigation />
      <div className="max-w-6xl mx-auto px-8">
        <h1 className="text-5xl font-bold mb-8 text-white">Learn</h1>
        <p className="text-lg text-gray-400 mb-8">
          Detailed information about your credit cards and miles progress
        </p>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {cards?.map((card, index) => {
            const percentage = (card.currentMiles / card.monthlyRewardCap) * 100;
            const remainingMiles = card.monthlyRewardCap - card.currentMiles;

            return (
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

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="w-full h-8 bg-[#0f1419] rounded-lg overflow-hidden">
                    <div className="h-full flex">
                      <div
                        className="bg-[#3ecf8e] h-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                      <div
                        className="bg-[#2d333b] h-full transition-all"
                        style={{ width: `${100 - percentage}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="space-y-2 text-white">
                  <div className="flex justify-between text-base">
                    <span className="font-medium text-gray-400">Current Miles:</span>
                    <span>{card.currentMiles.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-base">
                    <span className="font-medium text-gray-400">Monthly Cap:</span>
                    <span>{card.monthlyRewardCap.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-base">
                    <span className="font-medium text-gray-400">Remaining:</span>
                    <span>{remainingMiles.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-base">
                    <span className="font-medium text-gray-400">Progress:</span>
                    <span className="text-[#3ecf8e]">{percentage.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between text-base">
                    <span className="font-medium text-gray-400">Miles per Dollar:</span>
                    <span>{card.milesPerDollar}</span>
                  </div>
                  <div className="flex justify-between text-base">
                    <span className="font-medium text-gray-400">Spending Limit:</span>
                    <span>{card.spendingLimit.toLocaleString()}</span>
                  </div>
                </div>

                {/* Notes Section */}
                {card.notes && (
                  <div className="mt-4 pt-4 border-t border-[#2d333b]">
                    <p className="text-sm font-medium text-gray-400 mb-1">Notes:</p>
                    <p className="text-sm text-gray-300">{card.notes}</p>
                  </div>
                )}

                {/* Additional Info */}
                <div className="mt-4 pt-4 border-t border-[#2d333b]">
                  <p className="text-sm text-gray-400">
                    {percentage >= 100
                      ? "🎉 Congratulations! You've reached your target!"
                      : percentage >= 75
                      ? "🔥 Almost there! Keep going!"
                      : percentage >= 50
                      ? "💪 Halfway to your goal!"
                      : "🚀 Great start! Keep earning!"}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {(!cards || cards.length === 0) && (
          <div className="text-center py-12">
            <p className="text-xl text-gray-400">
              No cards found. Add your first card to get started!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
