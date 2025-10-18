import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Combined query to get user cards with their supported card details
export const get = query({
  args: {},
  handler: async (ctx) => {
    const userCards = await ctx.db.query("userCards").collect();

    const cardsWithDetails = await Promise.all(
      userCards.map(async (userCard) => {
        const supportedCard = await ctx.db.get(userCard.supportedCardId);
        if (!supportedCard) return null;

        return {
          ...supportedCard,
          currentMiles: userCard.currentMiles,
          nickname: userCard.nickname,
          userNotes: userCard.userNotes,
          userCardId: userCard._id,
        };
      })
    );

    // Filter out any null values
    return cardsWithDetails.filter((card) => card !== null);
  },
});

export const getAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("userCards").collect();
  },
});

export const add = mutation({
  args: {
    supportedCardId: v.id("supportedCards"),
    nickname: v.optional(v.string()),
    currentMiles: v.number(),
    userNotes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const cardId = await ctx.db.insert("userCards", {
      supportedCardId: args.supportedCardId,
      nickname: args.nickname,
      currentMiles: args.currentMiles,
      userNotes: args.userNotes,
    });
    return cardId;
  },
});

export const update = mutation({
  args: {
    id: v.id("userCards"),
    nickname: v.optional(v.string()),
    currentMiles: v.optional(v.number()),
    userNotes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, updates);
    return id;
  },
});

export const remove = mutation({
  args: {
    id: v.id("userCards"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
