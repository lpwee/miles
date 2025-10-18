"use client";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import Image from "next/image";
import Navigation from "../components/Navigation";

export default function Learn() {
  const cards = useQuery(api.cards.get);

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <div className="max-w-6xl mx-auto px-8">
        <h1 className="text-6xl font-bold mb-8 text-black">Learn</h1>
        <p className="text-xl text-black mb-8">
          Detailed information about your credit cards and miles progress
        </p>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {cards?.map((card, index) => {
            const percentage = (card.currentMiles / card.monthlyRewardCap) * 100;
            const remainingMiles = card.monthlyRewardCap - card.currentMiles;

            return (
              <div
                key={index}
                className="border-4 border-gray-500 rounded-2xl p-6 bg-white"
              >
                {/* Card Image */}
                <div className="w-full h-40 relative mb-4">
                  <Image
                    src={card.imageUrl}
                    alt={card.name}
                    fill
                    className="object-contain"
                  />
                </div>

                {/* Card Name */}
                <h2 className="text-2xl font-bold text-black mb-4">
                  {card.name}
                </h2>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="w-full h-8 bg-gray-200 rounded-lg overflow-hidden">
                    <div className="h-full flex">
                      <div
                        className="bg-green-500 h-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                      <div
                        className="bg-orange-500 h-full transition-all"
                        style={{ width: `${100 - percentage}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="space-y-2 text-black">
                  <div className="flex justify-between text-lg">
                    <span className="font-semibold">Current Miles:</span>
                    <span>{card.currentMiles.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-lg">
                    <span className="font-semibold">Monthly Cap:</span>
                    <span>{card.monthlyRewardCap.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-lg">
                    <span className="font-semibold">Remaining:</span>
                    <span>{remainingMiles.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-lg">
                    <span className="font-semibold">Progress:</span>
                    <span>{percentage.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between text-lg">
                    <span className="font-semibold">Miles per Dollar:</span>
                    <span>{card.milesPerDollar}</span>
                  </div>
                  <div className="flex justify-between text-lg">
                    <span className="font-semibold">Spending Limit:</span>
                    <span>{card.spendingLimit.toLocaleString()}</span>
                  </div>
                </div>

                {/* Notes Section */}
                {card.notes && (
                  <div className="mt-4 pt-4 border-t-2 border-gray-300">
                    <p className="text-sm font-semibold text-black mb-1">Notes:</p>
                    <p className="text-sm text-gray-700">{card.notes}</p>
                  </div>
                )}

                {/* Additional Info */}
                <div className="mt-4 pt-4 border-t-2 border-gray-300">
                  <p className="text-sm text-gray-700">
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
            <p className="text-2xl text-gray-500">
              No cards found. Add your first card to get started!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
