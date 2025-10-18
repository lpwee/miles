"use client";

import { useMutation, useQuery } from "convex/react";
import { Authenticated, Unauthenticated } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Navigation from "../components/Navigation";
import type { Id } from "../../convex/_generated/dataModel";
import Link from "next/link";

export default function AddCard() {
  const router = useRouter();
  const addUserCard = useMutation(api.userCards.add);
  const supportedCards = useQuery(api.supportedCards.get);
  const [formData, setFormData] = useState({
    supportedCardId: "" as Id<"supportedCards"> | "",
    nickname: "",
    currentMiles: 0,
    userNotes: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.supportedCardId) {
      alert("Please select a card type.");
      return;
    }

    try {
      await addUserCard({
        supportedCardId: formData.supportedCardId as Id<"supportedCards">,
        nickname: formData.nickname || undefined,
        currentMiles: formData.currentMiles,
        userNotes: formData.userNotes || undefined,
      });
      router.push("/");
    } catch (error) {
      console.error("Error adding card:", error);
      alert("Failed to add card. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[#0f1419]">
      <Navigation />
      <Authenticated>
        <div className="max-w-2xl mx-auto px-8">
        <h1 className="text-5xl font-bold mb-8 text-white">Add Card</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-lg font-medium text-gray-300 mb-2">
              Select Card Type <span className="text-red-400">*</span>
            </label>
            <select
              required
              value={formData.supportedCardId}
              onChange={(e) =>
                setFormData({ ...formData, supportedCardId: e.target.value as Id<"supportedCards"> })
              }
              className="w-full px-4 py-3 border border-[#2d333b] rounded-lg bg-[#1a1f25] text-white text-lg focus:outline-none focus:border-[#3ecf8e] transition-colors"
            >
              <option value="">-- Choose a card --</option>
              {supportedCards?.map((card) => (
                <option key={card._id} value={card._id}>
                  {card.name} ({card.milesPerDollar} miles/$)
                </option>
              ))}
            </select>
            {formData.supportedCardId && supportedCards && (
              <div className="mt-3 p-4 bg-[#1a1f25] border border-[#2d333b] rounded-lg">
                {(() => {
                  const selectedCard = supportedCards.find(c => c._id === formData.supportedCardId);
                  return selectedCard ? (
                    <div className="text-sm text-gray-300 space-y-1">
                      <p><span className="font-medium text-gray-400">Miles per Dollar:</span> {selectedCard.milesPerDollar}</p>
                      <p><span className="font-medium text-gray-400">Monthly Cap:</span> {selectedCard.monthlyRewardCap.toLocaleString()}</p>
                      <p><span className="font-medium text-gray-400">Spending Limit:</span> ${selectedCard.spendingLimit.toLocaleString()}</p>
                      {selectedCard.notes && (
                        <p><span className="font-medium text-gray-400">Notes:</span> {selectedCard.notes}</p>
                      )}
                    </div>
                  ) : null;
                })()}
              </div>
            )}
          </div>

          <div>
            <label className="block text-lg font-medium text-gray-300 mb-2">
              Nickname (Optional)
            </label>
            <input
              type="text"
              value={formData.nickname}
              onChange={(e) =>
                setFormData({ ...formData, nickname: e.target.value })
              }
              className="w-full px-4 py-3 border border-[#2d333b] rounded-lg bg-[#1a1f25] text-white text-lg focus:outline-none focus:border-[#3ecf8e] transition-colors"
              placeholder="e.g., My Travel Card"
            />
          </div>

          <div>
            <label className="block text-lg font-medium text-gray-300 mb-2">
              Current Miles
            </label>
            <input
              type="number"
              required
              min="0"
              value={formData.currentMiles}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  currentMiles: parseInt(e.target.value) || 0,
                })
              }
              className="w-full px-4 py-3 border border-[#2d333b] rounded-lg bg-[#1a1f25] text-white text-lg focus:outline-none focus:border-[#3ecf8e] transition-colors"
              placeholder="0"
            />
          </div>

          <div>
            <label className="block text-lg font-medium text-gray-300 mb-2">
              Personal Notes (Optional)
            </label>
            <textarea
              value={formData.userNotes}
              onChange={(e) =>
                setFormData({ ...formData, userNotes: e.target.value })
              }
              className="w-full px-4 py-3 border border-[#2d333b] rounded-lg bg-[#1a1f25] text-white text-lg focus:outline-none focus:border-[#3ecf8e] transition-colors"
              placeholder="e.g., Using this for groceries and dining"
              rows={3}
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={!formData.supportedCardId}
              className={`flex-1 font-semibold py-3 px-6 rounded-lg text-lg transition-colors ${
                !formData.supportedCardId
                  ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                  : "bg-[#3ecf8e] hover:bg-[#35b67d] text-[#0f1419]"
              }`}
            >
              Add Card to My Account
            </button>
            <button
              type="button"
              onClick={() => router.push("/")}
              className="flex-1 bg-[#2d333b] hover:bg-[#3d434b] text-white font-semibold py-3 px-6 rounded-lg text-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
        </div>
      </Authenticated>
      <Unauthenticated>
        <div className="max-w-6xl mx-auto px-8">
          <div className="text-center py-24">
            <h1 className="text-5xl font-bold mb-4 text-white">Add Card</h1>
            <p className="text-xl text-gray-400 mb-8">
              Please sign in to add cards to your account.
            </p>
            <Link
              href="/login"
              className="inline-block bg-[#3ecf8e] text-[#0f1419] px-8 py-3 rounded-lg font-semibold hover:bg-[#35b67a] transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </Unauthenticated>
    </div>
  );
}
