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
  }).index("by_user", ["userId"]),
  transactions: defineTable({
    userId: v.id("users"),
    userCardId: v.id("userCards"),
    amountInCents: v.number(), // stored as integer in cents (e.g., 1050 = $10.50)
    category: v.string(), // "travel", "entertainment", "groceries", etc.
    date: v.number(), // timestamp in milliseconds
    description: v.optional(v.string()),
    notionPageId: v.optional(v.string()), // Notion page ID if synced from Notion
  })
    .index("by_user", ["userId"])
    .index("by_card", ["userCardId"])
    .index("by_user_and_date", ["userId", "date"])
    .index("by_notion_page", ["notionPageId"])
});
