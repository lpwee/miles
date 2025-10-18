import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server"
import { v } from "convex/values";

export default defineSchema({
  ...authTables,
  supportedCards: defineTable({
    name: v.string(),
    imageUrl: v.string(),
    milesPerDollar: v.number(),
    monthlyRewardCap: v.number(),
    spendingLimit: v.number(),
    notes: v.optional(v.string()),
  }),
  userCards: defineTable({
    userId: v.id("users"),
    supportedCardId: v.id("supportedCards"),
    nickname: v.optional(v.string()),
    currentMiles: v.number(),
    userNotes: v.optional(v.string())
  }).index("by_user", ["userId"])
});
