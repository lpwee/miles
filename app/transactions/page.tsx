"use client";

import { useAction, useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useRouter } from "next/navigation";
import Navigation from "../components/Navigation";
import type { Id } from "../../convex/_generated/dataModel";
import { useState } from "react";

export default function Transactions() {
  const router = useRouter();
  const transactions = useQuery(api.transactions.get);
  const removeTransaction = useMutation(api.transactions.remove);
  const syncFromNotion = useAction(api.notionSync.manualSync);
  const [isSyncing, setIsSyncing] = useState(false);

  const handleDelete = async (transactionId: Id<"transactions">) => {
    if (confirm("Are you sure you want to delete this transaction? This will also reverse the miles earned.")) {
      try {
        await removeTransaction({ transactionId });
      } catch (error) {
        console.error("Error deleting transaction:", error);
        alert("Failed to delete transaction. Please try again.");
      }
    }
  };

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      const result = await syncFromNotion();
      if (result.success) {
        alert(`Synced ${result.synced} transaction(s) from Notion!`);
      } else {
        alert(`Sync failed: ${result.error}`);
      }
    } catch (error) {
      console.error("Error syncing from Notion:", error);
      alert("Failed to sync from Notion. Please try again.");
    } finally {
      setIsSyncing(false);
    }
  };

  const formatAmount = (cents: number) => {
    const dollars = Math.floor(cents / 100);
    const remainingCents = cents % 100;
    return `$${dollars}.${remainingCents.toString().padStart(2, "0")}`;
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-[#0f1419]">
      <Navigation />
      <div className="max-w-6xl mx-auto px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-5xl font-bold text-white">Transactions</h1>
          <div className="flex gap-3">
            <button
              onClick={handleSync}
              disabled={isSyncing}
              className={`font-semibold py-3 px-6 rounded-lg text-lg transition-colors ${
                isSyncing
                  ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                  : "bg-[#2d333b] hover:bg-[#3d434b] text-white"
              }`}
            >
              {isSyncing ? "Syncing..." : "Sync from Notion"}
            </button>
            <button
              onClick={() => router.push("/transactions/add")}
              className="bg-[#3ecf8e] hover:bg-[#35b67d] text-[#0f1419] font-semibold py-3 px-6 rounded-lg text-lg transition-colors"
            >
              + Add Transaction
            </button>
          </div>
        </div>

        {!transactions ? (
          <div className="text-gray-400 text-lg">Loading transactions...</div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-400 text-xl mb-6">No transactions yet</p>
            <button
              onClick={() => router.push("/transactions/add")}
              className="bg-[#3ecf8e] hover:bg-[#35b67d] text-[#0f1419] font-semibold py-3 px-6 rounded-lg text-lg transition-colors"
            >
              Add your first transaction
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-[#2d333b]">
                  <th className="text-left py-4 px-4 text-gray-300 font-semibold">Date</th>
                  <th className="text-left py-4 px-4 text-gray-300 font-semibold">Card</th>
                  <th className="text-left py-4 px-4 text-gray-300 font-semibold">Category</th>
                  <th className="text-left py-4 px-4 text-gray-300 font-semibold">Description</th>
                  <th className="text-right py-4 px-4 text-gray-300 font-semibold">Amount</th>
                  <th className="text-right py-4 px-4 text-gray-300 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr
                    key={transaction._id}
                    className="border-b border-[#2d333b] hover:bg-[#1a1f25] transition-colors"
                  >
                    <td className="py-4 px-4 text-gray-300">
                      {formatDate(transaction.date)}
                    </td>
                    <td className="py-4 px-4 text-gray-300">
                      {transaction.cardNickname || transaction.cardName}
                    </td>
                    <td className="py-4 px-4">
                      <span className="inline-block px-3 py-1 rounded-full text-sm bg-[#2d333b] text-gray-300">
                        {transaction.category.charAt(0).toUpperCase() + transaction.category.slice(1)}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-gray-400">
                      {transaction.description || "-"}
                    </td>
                    <td className="py-4 px-4 text-right text-white font-semibold">
                      {formatAmount(transaction.amountInCents)}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <button
                        onClick={() => handleDelete(transaction._id)}
                        className="text-red-400 hover:text-red-300 font-medium transition-colors"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
