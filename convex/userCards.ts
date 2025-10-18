import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

// Combined query to get user cards with their supported card details
export const get = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }

    const userCards = await ctx.db
      .query("userCards")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

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
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }
    return await ctx.db
      .query("userCards")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
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
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Must be authenticated to add cards");
    }

    const cardId = await ctx.db.insert("userCards", {
      userId,
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
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Must be authenticated to update cards");
    }

    const { id, ...updates } = args;

    // Verify the card belongs to the user
    const card = await ctx.db.get(id);
    if (!card || card.userId !== userId) {
      throw new Error("Card not found or unauthorized");
    }

    await ctx.db.patch(id, updates);
    return id;
  },
});

export const remove = mutation({
  args: {
    id: v.id("userCards"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Must be authenticated to delete cards");
    }

    // Verify the card belongs to the user
    const card = await ctx.db.get(args.id);
    if (!card || card.userId !== userId) {
      throw new Error("Card not found or unauthorized");
    }

    await ctx.db.delete(args.id);
  },
});
