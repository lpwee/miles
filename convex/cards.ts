import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("cards").collect();
  },
});

export const add = mutation({
  args: {
    name: v.string(),
    imageUrl: v.string(),
    currentMiles: v.number(),
    milesPerDollar: v.number(),
    monthlyRewardCap: v.number(),
    spendingLimit: v.number(),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const cardId = await ctx.db.insert("cards", {
      name: args.name,
      imageUrl: args.imageUrl,
      currentMiles: args.currentMiles,
      milesPerDollar: args.milesPerDollar,
      monthlyRewardCap: args.monthlyRewardCap,
      spendingLimit: args.spendingLimit,
      notes: args.notes,
    });
    return cardId;
  },
});
