"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Navigation from "../../components/Navigation";
import type { Id } from "../../../convex/_generated/dataModel";

const CATEGORIES = [
  "travel",
  "entertainment",
  "groceries",
  "dining",
  "shopping",
  "gas",
  "utilities",
  "other",
];

export default function AddTransaction() {
  const router = useRouter();
  const addTransaction = useMutation(api.transactions.add);
  const userCards = useQuery(api.userCards.get);
  const [formData, setFormData] = useState({
    userCardId: "" as Id<"userCards"> | "",
    dollars: "",
    cents: "",
    category: "",
    date: new Date().toISOString().split("T")[0], // YYYY-MM-DD format
    description: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.userCardId) {
      alert("Please select a card.");
      return;
    }

    if (!formData.category) {
      alert("Please select a category.");
      return;
    }

    const dollars = parseInt(formData.dollars) || 0;
    const cents = parseInt(formData.cents) || 0;
    const amountInCents = dollars * 100 + cents;

    if (amountInCents <= 0) {
      alert("Please enter a valid amount.");
      return;
    }

    try {
      const transactionDate = new Date(formData.date).getTime();

      await addTransaction({
        userCardId: formData.userCardId as Id<"userCards">,
        amountInCents,
        category: formData.category,
        date: transactionDate,
        description: formData.description || undefined,
      });
      router.push("/transactions");
    } catch (error) {
      console.error("Error adding transaction:", error);
      alert("Failed to add transaction. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[#0f1419]">
      <Navigation />
      <div className="max-w-2xl mx-auto px-8">
        <h1 className="text-5xl font-bold mb-8 text-white">Add Transaction</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-lg font-medium text-gray-300 mb-2">
              Card <span className="text-red-400">*</span>
            </label>
            <select
              required
              value={formData.userCardId}
              onChange={(e) =>
                setFormData({ ...formData, userCardId: e.target.value as Id<"userCards"> })
              }
              className="w-full px-4 py-3 border border-[#2d333b] rounded-lg bg-[#1a1f25] text-white text-lg focus:outline-none focus:border-[#3ecf8e] transition-colors"
            >
              <option value="">-- Choose a card --</option>
              {userCards?.map((card) => (
                <option key={card._id} value={card._id}>
                  {card.nickname || card.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-lg font-medium text-gray-300 mb-2">
              Amount <span className="text-red-400">*</span>
            </label>
            <div className="flex gap-3 items-center">
              <div className="flex-1">
                <label className="block text-sm text-gray-400 mb-1">Dollars</label>
                <input
                  type="number"
                  required
                  min="0"
                  value={formData.dollars}
                  onChange={(e) =>
                    setFormData({ ...formData, dollars: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-[#2d333b] rounded-lg bg-[#1a1f25] text-white text-lg focus:outline-none focus:border-[#3ecf8e] transition-colors"
                  placeholder="0"
                />
              </div>
              <span className="text-gray-400 text-2xl mt-6">.</span>
              <div className="flex-1">
                <label className="block text-sm text-gray-400 mb-1">Cents</label>
                <input
                  type="number"
                  required
                  min="0"
                  max="99"
                  value={formData.cents}
                  onChange={(e) =>
                    setFormData({ ...formData, cents: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-[#2d333b] rounded-lg bg-[#1a1f25] text-white text-lg focus:outline-none focus:border-[#3ecf8e] transition-colors"
                  placeholder="00"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-lg font-medium text-gray-300 mb-2">
              Category <span className="text-red-400">*</span>
            </label>
            <select
              required
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              className="w-full px-4 py-3 border border-[#2d333b] rounded-lg bg-[#1a1f25] text-white text-lg focus:outline-none focus:border-[#3ecf8e] transition-colors"
            >
              <option value="">-- Choose a category --</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-lg font-medium text-gray-300 mb-2">
              Date <span className="text-red-400">*</span>
            </label>
            <input
              type="date"
              required
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
              className="w-full px-4 py-3 border border-[#2d333b] rounded-lg bg-[#1a1f25] text-white text-lg focus:outline-none focus:border-[#3ecf8e] transition-colors"
            />
          </div>

          <div>
            <label className="block text-lg font-medium text-gray-300 mb-2">
              Description (Optional)
            </label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full px-4 py-3 border border-[#2d333b] rounded-lg bg-[#1a1f25] text-white text-lg focus:outline-none focus:border-[#3ecf8e] transition-colors"
              placeholder="e.g., Hotel booking for vacation"
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={!formData.userCardId || !formData.category}
              className={`flex-1 font-semibold py-3 px-6 rounded-lg text-lg transition-colors ${
                !formData.userCardId || !formData.category
                  ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                  : "bg-[#3ecf8e] hover:bg-[#35b67d] text-[#0f1419]"
              }`}
            >
              Add Transaction
            </button>
            <button
              type="button"
              onClick={() => router.push("/transactions")}
              className="flex-1 bg-[#2d333b] hover:bg-[#3d434b] text-white font-semibold py-3 px-6 rounded-lg text-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
