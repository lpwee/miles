import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

// Add a new transaction
export const add = mutation({
  args: {
    userCardId: v.id("userCards"),
    amountInCents: v.number(),
    category: v.string(),
    date: v.optional(v.number()), // optional, defaults to now
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    // Verify the card belongs to the user
    const userCard = await ctx.db.get(args.userCardId);
    if (!userCard || userCard.userId !== userId) {
      throw new Error("Card not found or does not belong to user");
    }

    // Create the transaction
    const transactionId = await ctx.db.insert("transactions", {
      userId,
      userCardId: args.userCardId,
      amountInCents: args.amountInCents,
      category: args.category,
      date: args.date ?? Date.now(),
      description: args.description,
    });

    // Calculate miles earned based on the card's reward rate
    const supportedCard = await ctx.db.get(userCard.supportedCardId);
    if (!supportedCard) {
      throw new Error("Supported card not found");
    }

    const amountInDollars = args.amountInCents / 100;
    const milesEarned = amountInDollars * supportedCard.milesPerDollar;

    // Update the user's card miles
    await ctx.db.patch(args.userCardId, {
      currentMiles: userCard.currentMiles + milesEarned,
    });

    return transactionId;
  },
});

// Get all transactions for the current user
export const get = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }

    const transactions = await ctx.db
      .query("transactions")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();

    // Enrich with card details
    const enrichedTransactions = await Promise.all(
      transactions.map(async (transaction) => {
        const userCard = await ctx.db.get(transaction.userCardId);
        const supportedCard = userCard
          ? await ctx.db.get(userCard.supportedCardId)
          : null;

        return {
          ...transaction,
          cardName: supportedCard?.name ?? "Unknown Card",
          cardNickname: userCard?.nickname,
        };
      })
    );

    return enrichedTransactions;
  },
});

// Get transactions for a specific card
export const getByCard = query({
  args: {
    userCardId: v.id("userCards"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }

    // Verify the card belongs to the user
    const userCard = await ctx.db.get(args.userCardId);
    if (!userCard || userCard.userId !== userId) {
      return [];
    }

    const transactions = await ctx.db
      .query("transactions")
      .withIndex("by_card", (q) => q.eq("userCardId", args.userCardId))
      .order("desc")
      .collect();

    return transactions;
  },
});

// Delete a transaction
export const remove = mutation({
  args: {
    transactionId: v.id("transactions"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const transaction = await ctx.db.get(args.transactionId);
    if (!transaction || transaction.userId !== userId) {
      throw new Error("Transaction not found or does not belong to user");
    }

    // Get card details to reverse the miles
    const userCard = await ctx.db.get(transaction.userCardId);
    if (userCard) {
      const supportedCard = await ctx.db.get(userCard.supportedCardId);
      if (supportedCard) {
        const amountInDollars = transaction.amountInCents / 100;
        const milesEarned = amountInDollars * supportedCard.milesPerDollar;

        // Subtract the miles from the card
        await ctx.db.patch(transaction.userCardId, {
          currentMiles: Math.max(0, userCard.currentMiles - milesEarned),
        });
      }
    }

    await ctx.db.delete(args.transactionId);
  },
});
