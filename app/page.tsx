"use client";

import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import Image from "next/image";
import Navigation from "./components/Navigation";

export default function Home() {
  const cards = useQuery(api.cards.get);

  return (
    <div className="min-h-screen bg-[#0f1419]">
      <Navigation />
      <div className="max-w-6xl mx-auto px-8">
        <h1 className="text-5xl font-bold mb-8 text-white">My Cards</h1>

        <div className="space-y-4">
          {/* Table Header */}
          <div className="grid grid-cols-[200px_1fr_200px] gap-4 px-8 pb-4">
            <div className="text-xl font-semibold text-gray-400">Name</div>
            <div className="text-xl font-semibold text-gray-400">Miles</div>
            <div className="text-xl font-semibold text-gray-400 text-right">Earned</div>
          </div>

          {/* Card Rows */}
          {cards?.map((card, index) => {
            const percentage = (card.currentMiles / card.monthlyRewardCap) * 100;

            return (
              <div
                key={index}
                className="border border-[#2d333b] rounded-xl p-6 bg-[#1a1f25] hover:border-[#3ecf8e] transition-colors"
              >
                <div className="grid grid-cols-[200px_1fr_200px] gap-4 items-center">
                  {/* Card Image and Name */}
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 relative flex-shrink-0 bg-[#2d333b] rounded flex items-center justify-center">
                      {card.imageUrl ? (
                        <Image
                          src={card.imageUrl}
                          alt={card.name}
                          fill
                          className="object-contain rounded"
                        />
                      ) : (
                        <span className="text-gray-500 text-2xl">📷</span>
                      )}
                    </div>
                    <span className="text-lg font-medium text-white">{card.name}</span>
                  </div>

                  {/* Progress Bar */}
                  <div className="flex items-center">
                    <div className="w-full h-10 bg-[#0f1419] rounded-lg overflow-hidden">
                      <div className="h-full flex">
                        <div
                          className="bg-[#3ecf8e] h-full transition-all"
                          style={{ width: `${percentage}%` }}
                        />
                        <div
                          className="bg-[#2d333b] h-full"
                          style={{ width: `${100 - percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Miles Count */}
                  <div className="text-right">
                    <span className="text-xl font-medium text-white">
                      {card.currentMiles.toLocaleString()}/{card.monthlyRewardCap.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
