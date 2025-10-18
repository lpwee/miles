"use client";

import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Navigation from "../components/Navigation";
import { UploadButton } from "../lib/uploadthing";

export default function AddCard() {
  const router = useRouter();
  const addCard = useMutation(api.cards.add);
  const [formData, setFormData] = useState({
    name: "",
    imageUrl: "",
    currentMiles: 0,
    milesPerDollar: 0,
    monthlyRewardCap: 0,
    spendingLimit: 0,
    notes: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addCard(formData);
      router.push("/");
    } catch (error) {
      console.error("Error adding card:", error);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <div className="max-w-2xl mx-auto px-8">
        <h1 className="text-6xl font-bold mb-8 text-black">Add Card</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xl font-semibold text-black mb-2">
              Card Name
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-4 py-3 border-2 border-gray-500 rounded-lg text-black text-lg"
              placeholder="e.g., UOB Lady's Card"
            />
          </div>

          <div>
            <label className="block text-xl font-semibold text-black mb-2">
              Card Image
            </label>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <UploadButton
                  endpoint="imageUploader"
                  onClientUploadComplete={(res) => {
                    // Do something with the response
                    if (res?.[0]?.serverData?.url) {
                      setFormData({ ...formData, imageUrl: res[0].serverData.url });
                      alert("Upload Completed!");
                    }
                  }}
                  onUploadError={(error: Error) => {
                    // Do something with the error.
                    alert(`ERROR! ${error.message}`);
                  }}
                />
                {formData.imageUrl && (
                  <span className="text-green-600 font-semibold">
                    ✓ Image uploaded
                  </span>
                )}
              </div>
              <div className="text-center text-gray-600">or</div>
              <input
                type="text"
                value={formData.imageUrl}
                onChange={(e) =>
                  setFormData({ ...formData, imageUrl: e.target.value })
                }
                className="w-full px-4 py-3 border-2 border-gray-500 rounded-lg text-black text-lg"
                placeholder="Or paste image URL: /card-image.svg"
              />
            </div>
          </div>

          <div>
            <label className="block text-xl font-semibold text-black mb-2">
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
              className="w-full px-4 py-3 border-2 border-gray-500 rounded-lg text-black text-lg"
            />
          </div>

          <div>
            <label className="block text-xl font-semibold text-black mb-2">
              Miles per Dollar
            </label>
            <input
              type="number"
              required
              step="0.1"
              min="0"
              value={formData.milesPerDollar}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  milesPerDollar: parseFloat(e.target.value) || 0,
                })
              }
              className="w-full px-4 py-3 border-2 border-gray-500 rounded-lg text-black text-lg"
              placeholder="e.g., 1.2"
            />
          </div>

          <div>
            <label className="block text-xl font-semibold text-black mb-2">
              Monthly Reward Cap
            </label>
            <input
              type="number"
              required
              min="0"
              value={formData.monthlyRewardCap}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  monthlyRewardCap: parseInt(e.target.value) || 0,
                })
              }
              className="w-full px-4 py-3 border-2 border-gray-500 rounded-lg text-black text-lg"
              placeholder="e.g., 10000"
            />
          </div>

          <div>
            <label className="block text-xl font-semibold text-black mb-2">
              Spending Limit
            </label>
            <input
              type="number"
              required
              min="0"
              value={formData.spendingLimit}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  spendingLimit: parseInt(e.target.value) || 0,
                })
              }
              className="w-full px-4 py-3 border-2 border-gray-500 rounded-lg text-black text-lg"
              placeholder="e.g., 5000"
            />
          </div>

          <div>
            <label className="block text-xl font-semibold text-black mb-2">
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              className="w-full px-4 py-3 border-2 border-gray-500 rounded-lg text-black text-lg"
              placeholder="e.g., Popular cashback/miles card"
              rows={3}
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg text-xl"
            >
              Add Card
            </button>
            <button
              type="button"
              onClick={() => router.push("/")}
              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg text-xl"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
