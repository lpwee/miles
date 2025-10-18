import { mutation } from "./_generated/server";

export const seedCards = mutation({
  args: {},
  handler: async (ctx) => {
    // Clear existing cards
    const existingCards = await ctx.db.query("cards").collect();
    for (const card of existingCards) {
      await ctx.db.delete(card._id);
    }

    // Add sample cards
    await ctx.db.insert("cards", {
      name: "UOB Lady's Card",
      imageUrl: "/card-image.svg",
      currentMiles: 3200,
      milesPerDollar: 1.4,
      monthlyRewardCap: 10000,
      spendingLimit: 3000,
      notes: "Popular cashback/miles card",
    });

    await ctx.db.insert("cards", {
      name: "Amex Centurion",
      imageUrl: "/card-image.svg",
      currentMiles: 200,
      milesPerDollar: 2.0,
      monthlyRewardCap: 25000,
      spendingLimit: 10000,
      notes: "Premium rewards card",
    });

    await ctx.db.insert("cards", {
      name: "DBS Live Fresh Card",
      imageUrl: "/card-image.svg",
      currentMiles: 2500,
      milesPerDollar: 1.2,
      monthlyRewardCap: 8000,
      spendingLimit: 2500,
      notes: "Flexible rewards card",
    });

    return { success: true };
  },
});
