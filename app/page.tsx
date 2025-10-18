"use client";

import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import Image from "next/image";
import Navigation from "./components/Navigation";

export default function Home() {
  const cards = useQuery(api.cards.get);

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <div className="max-w-6xl mx-auto px-8">
        <h1 className="text-6xl font-bold mb-8 text-black">My Cards</h1>

        <div className="space-y-4">
          {/* Table Header */}
          <div className="grid grid-cols-[200px_1fr_200px] gap-4 px-8 pb-4">
            <div className="text-2xl font-semibold text-black">Name</div>
            <div className="text-2xl font-semibold text-black">Miles</div>
            <div className="text-2xl font-semibold text-black text-right">Earned</div>
          </div>

          {/* Card Rows */}
          {cards?.map((card, index) => {
            const percentage = (card.currentMiles / card.monthlyRewardCap) * 100;

            return (
              <div
                key={index}
                className="border-4 border-gray-500 rounded-2xl p-6 bg-white"
              >
                <div className="grid grid-cols-[200px_1fr_200px] gap-4 items-center">
                  {/* Card Image and Name */}
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 relative flex-shrink-0">
                      <Image
                        src={card.imageUrl}
                        alt={card.name}
                        fill
                        className="object-contain rounded"
                      />
                    </div>
                    <span className="text-xl font-normal text-black">{card.name}</span>
                  </div>

                  {/* Progress Bar */}
                  <div className="flex items-center">
                    <div className="w-full h-12 bg-gray-200 rounded-lg overflow-hidden">
                      <div className="h-full flex">
                        <div
                          className="bg-green-500 h-full"
                          style={{ width: `${percentage}%` }}
                        />
                        <div
                          className="bg-orange-500 h-full"
                          style={{ width: `${100 - percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Miles Count */}
                  <div className="text-right">
                    <span className="text-2xl font-normal text-black">
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
