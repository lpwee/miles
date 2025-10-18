import { mutation } from "./_generated/server";

export const seedCards = mutation({
  args: {},
  handler: async (ctx) => {
    // Clear existing cards
    const existingCards = await ctx.db.query("cards").collect();
    for (const card of existingCards) {
      await ctx.db.delete(card._id);
    }

    // Add sample cards (matching the screenshot)
    await ctx.db.insert("cards", {
      name: "UOB Lady's Card",
      imageUrl: "/card-image.svg",
      currentMiles: 3200,
      totalMiles: 5000,
    });

    await ctx.db.insert("cards", {
      name: "UOB Lady's Card",
      imageUrl: "/card-image.svg",
      currentMiles: 200,
      totalMiles: 5000,
    });

    await ctx.db.insert("cards", {
      name: "UOB Lady's Card",
      imageUrl: "/card-image.svg",
      currentMiles: 2500,
      totalMiles: 5000,
    });

    return { success: true };
  },
});
