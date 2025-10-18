import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  cards: defineTable({
    name: v.string(),
    imageUrl: v.string(),
    currentMiles: v.number(),
    milesPerDollar: v.number(),
    monthlyRewardCap: v.number(),
    spendingLimit: v.number(),
    notes: v.optional(v.string()),
  }),
});
