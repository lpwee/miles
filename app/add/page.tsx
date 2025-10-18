"use client";

import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Navigation from "../components/Navigation";
import { UploadDropzone } from "../lib/uploadthing";

export default function AddCard() {
  const router = useRouter();
  const addCard = useMutation(api.cards.add);
  const [isUploading, setIsUploading] = useState(false);
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

    // Validate that an image has been uploaded
    if (!formData.imageUrl) {
      alert("Please upload a card image before submitting.");
      return;
    }

    // Prevent submission while uploading
    if (isUploading) {
      alert("Please wait for the image upload to complete.");
      return;
    }

    try {
      await addCard(formData);
      router.push("/");
    } catch (error) {
      console.error("Error adding card:", error);
      alert("Failed to add card. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[#0f1419]">
      <Navigation />
      <div className="max-w-2xl mx-auto px-8">
        <h1 className="text-5xl font-bold mb-8 text-white">Add Card</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-lg font-medium text-gray-300 mb-2">
              Card Name
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-4 py-3 border border-[#2d333b] rounded-lg bg-[#1a1f25] text-white text-lg focus:outline-none focus:border-[#3ecf8e] transition-colors"
              placeholder="e.g., UOB Lady's Card"
            />
          </div>

          <div>
            <label className="block text-lg font-medium text-gray-300 mb-2">
              Card Image <span className="text-red-400">*</span>
            </label>
            <div className="space-y-4">
              <UploadDropzone
                endpoint="imageUploader"
                onUploadBegin={() => {
                  console.log("Upload started");
                  setIsUploading(true);
                }}
                onClientUploadComplete={(res) => {
                  console.log("Upload complete, full response:", res);
                  setIsUploading(false);

                  // Try multiple ways to get the URL
                  const imageUrl = res?.[0]?.serverData?.url || res?.[0]?.url;

                  if (imageUrl) {
                    console.log("Setting imageUrl to:", imageUrl);
                    setFormData((prev) => ({ ...prev, imageUrl }));
                  } else {
                    console.error("No URL found in response:", res);
                    alert("Upload completed but no URL was returned. Please try again.");
                  }
                }}
                onUploadError={(error: Error) => {
                  console.error("Upload error:", error);
                  setIsUploading(false);
                  alert(`Upload failed: ${error.message}`);
                }}
                appearance={{
                  container: "border-2 border-dashed border-[#2d333b] bg-[#1a1f25] rounded-lg",
                  uploadIcon: "text-[#3ecf8e]",
                  label: "text-gray-300",
                  allowedContent: "text-gray-400",
                  button: "bg-[#3ecf8e] text-[#0f1419] hover:bg-[#35b67d] transition-colors ut-ready:bg-[#3ecf8e] ut-uploading:bg-[#2d333b]"
                }}
              />
              {isUploading && (
                <div className="text-center">
                  <span className="text-yellow-400 font-semibold">
                    ⏳ Uploading...
                  </span>
                </div>
              )}
              {formData.imageUrl && !isUploading && (
                <div className="text-center space-y-2">
                  <span className="text-[#3ecf8e] font-semibold">
                    ✓ Image uploaded successfully
                  </span>
                  <p className="text-sm text-gray-400 break-all">{formData.imageUrl}</p>
                </div>
              )}
            </div>
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
            />
          </div>

          <div>
            <label className="block text-lg font-medium text-gray-300 mb-2">
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
              className="w-full px-4 py-3 border border-[#2d333b] rounded-lg bg-[#1a1f25] text-white text-lg focus:outline-none focus:border-[#3ecf8e] transition-colors"
              placeholder="e.g., 1.2"
            />
          </div>

          <div>
            <label className="block text-lg font-medium text-gray-300 mb-2">
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
              className="w-full px-4 py-3 border border-[#2d333b] rounded-lg bg-[#1a1f25] text-white text-lg focus:outline-none focus:border-[#3ecf8e] transition-colors"
              placeholder="e.g., 10000"
            />
          </div>

          <div>
            <label className="block text-lg font-medium text-gray-300 mb-2">
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
              className="w-full px-4 py-3 border border-[#2d333b] rounded-lg bg-[#1a1f25] text-white text-lg focus:outline-none focus:border-[#3ecf8e] transition-colors"
              placeholder="e.g., 5000"
            />
          </div>

          <div>
            <label className="block text-lg font-medium text-gray-300 mb-2">
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              className="w-full px-4 py-3 border border-[#2d333b] rounded-lg bg-[#1a1f25] text-white text-lg focus:outline-none focus:border-[#3ecf8e] transition-colors"
              placeholder="e.g., Popular cashback/miles card"
              rows={3}
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isUploading || !formData.imageUrl}
              className={`flex-1 font-semibold py-3 px-6 rounded-lg text-lg transition-colors ${
                isUploading || !formData.imageUrl
                  ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                  : "bg-[#3ecf8e] hover:bg-[#35b67d] text-[#0f1419]"
              }`}
            >
              {isUploading ? "Uploading..." : "Add Card"}
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
    </div>
  );
}
