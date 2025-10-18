import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  cards: defineTable({
    name: v.string(),
    imageUrl: v.string(),
    currentMiles: v.number(),
    totalMiles: v.number(),
  }),
});
