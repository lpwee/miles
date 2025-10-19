import { mutation } from "./_generated/server";

export const seedDatabase = mutation({
  args: {},
  handler: async (ctx) => {
    // Clear existing data
    const existingSupportedCards = await ctx.db.query("supportedCards").collect();
    for (const card of existingSupportedCards) {
      await ctx.db.delete(card._id);
    }

    const existingUserCards = await ctx.db.query("userCards").collect();
    for (const card of existingUserCards) {
      await ctx.db.delete(card._id);
    }

    // Seed supportedCards (card types/templates)
    const uobLadyCardId = await ctx.db.insert("supportedCards", {
      name: "UOB Lady's Card",
      imageUrl: "/card-image.svg",
      milesPerDollar: 1.4,
      monthlyRewardCap: 10000,
      spendingLimit: 3000,
      notes: "Popular cashback/miles card with good rewards rate",
    });

    const amexCenturionId = await ctx.db.insert("supportedCards", {
      name: "Amex Centurion",
      imageUrl: "/card-image.svg",
      milesPerDollar: 2.0,
      monthlyRewardCap: 25000,
      spendingLimit: 10000,
      notes: "Premium rewards card with highest miles earning rate",
    });

    const dbsLiveFreshId = await ctx.db.insert("supportedCards", {
      name: "DBS Live Fresh Card",
      imageUrl: "/card-image.svg",
      milesPerDollar: 1.2,
      monthlyRewardCap: 8000,
      spendingLimit: 2500,
      notes: "Flexible rewards card for everyday spending",
    });

    const citiPremierMilesId = await ctx.db.insert("supportedCards", {
      name: "Citi PremierMiles",
      imageUrl: "/card-image.svg",
      milesPerDollar: 1.6,
      monthlyRewardCap: 12000,
      spendingLimit: 5000,
      notes: "Great for travel rewards and airline miles",
    });

    const ocbc365Id = await ctx.db.insert("supportedCards", {
      name: "OCBC 365 Credit Card",
      imageUrl: "/card-image.svg",
      milesPerDollar: 1.0,
      monthlyRewardCap: 6000,
      spendingLimit: 2000,
      notes: "Good cashback on dining and groceries",
    });

    // Note: userCards are user-specific and shouldn't be seeded
    // Users will add their own cards after authentication

    return {
      success: true,
      message: "Database seeded successfully with supportedCards and userCards"
    };
  },
});
