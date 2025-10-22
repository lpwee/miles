import { v } from "convex/values";
import { action, internalAction, internalMutation } from "./_generated/server";
import { internal } from "./_generated/api";
import { Client } from "@notionhq/client";

// Internal mutation to create a transaction from Notion data
export const createTransactionFromNotion = internalMutation({
  args: {
    email: v.string(),
    cardName: v.string(),
    amountInCents: v.number(),
    category: v.string(),
    date: v.number(),
    description: v.optional(v.string()),
    notionPageId: v.string(),
  },
  handler: async (ctx, args) => {
    // Find user by email
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), args.email))
      .first();

    if (!user) {
      console.error(`User not found for email: ${args.email}`);
      return { success: false, error: "User not found" };
    }

    // Check if this Notion page has already been synced
    const existingTransaction = await ctx.db
      .query("transactions")
      .withIndex("by_notion_page", (q) => q.eq("notionPageId", args.notionPageId))
      .first();

    if (existingTransaction) {
      console.log(`Transaction already synced: ${args.notionPageId}`);
      return { success: true, message: "Already synced" };
    }

    // Get user's cards
    const userCards = await ctx.db
      .query("userCards")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    // Find matching card by name (case-insensitive)
    let matchingCard = null;
    const searchCardName = args.cardName.toLowerCase().trim();

    for (const userCard of userCards) {
      const supportedCard = await ctx.db.get(userCard.supportedCardId);
      if (!supportedCard) continue;

      const cardName = supportedCard.name.toLowerCase();
      const nickname = userCard.nickname?.toLowerCase();

      // Match against card name or nickname
      if (
        cardName.includes(searchCardName) ||
        searchCardName.includes(cardName) ||
        (nickname && (nickname.includes(searchCardName) || searchCardName.includes(nickname)))
      ) {
        matchingCard = { userCard, supportedCard };
        break;
      }
    }

    if (!matchingCard) {
      console.error(`Card not found for user ${args.email}: ${args.cardName}`);
      return { success: false, error: `Card "${args.cardName}" not found` };
    }

    // Create the transaction
    const transactionId = await ctx.db.insert("transactions", {
      userId: user._id,
      userCardId: matchingCard.userCard._id,
      amountInCents: args.amountInCents,
      category: args.category.toLowerCase(),
      date: args.date,
      description: args.description,
      notionPageId: args.notionPageId,
    });

    // Calculate and add miles to the card
    const amountInDollars = args.amountInCents / 100;
    const milesEarned = amountInDollars * matchingCard.supportedCard.milesPerDollar;

    await ctx.db.patch(matchingCard.userCard._id, {
      currentMiles: matchingCard.userCard.currentMiles + milesEarned,
    });

    console.log(`Transaction synced successfully: ${transactionId}`);
    return { success: true, transactionId };
  },
});

// Internal action to sync transactions from Notion (called by cron)
export const syncFromNotion = internalAction({
  args: {},
  handler: async (ctx) => {
    const notionApiKey = process.env.NOTION_API_KEY;
    const notionDatabaseId = process.env.NOTION_DATABASE_ID;

    if (!notionApiKey || !notionDatabaseId) {
      throw new Error("Notion API key or database ID not configured in environment variables");
    }

    const notion = new Client({ auth: notionApiKey });

    try {
      // Query the Notion database
      const response = await notion.databases.query({
        database_id: notionDatabaseId,
        filter: {
          property: "Synced",
          checkbox: {
            equals: false,
          },
        },
      });

      const results = [];

      for (const page of response.results) {
        try {
          // Extract properties from the Notion page
          const properties = (page as any).properties;

          // Get email
          const emailProp = properties.Email?.email;
          if (!emailProp) {
            console.error(`No email found for page ${page.id}`);
            continue;
          }

          // Get amount
          const amountProp = properties.Amount?.number;
          if (!amountProp) {
            console.error(`No amount found for page ${page.id}`);
            continue;
          }
          const amountInCents = Math.round(amountProp * 100);

          // Get card name
          let cardName = "";
          if (properties.Card?.rich_text?.[0]?.plain_text) {
            cardName = properties.Card.rich_text[0].plain_text;
          } else if (properties.Card?.select?.name) {
            cardName = properties.Card.select.name;
          }
          if (!cardName) {
            console.error(`No card found for page ${page.id}`);
            continue;
          }

          // Get category
          let category = "";
          if (properties.Category?.select?.name) {
            category = properties.Category.select.name;
          } else if (properties.Category?.rich_text?.[0]?.plain_text) {
            category = properties.Category.rich_text[0].plain_text;
          }
          if (!category) {
            console.error(`No category found for page ${page.id}`);
            continue;
          }

          // Get date
          const dateProp = properties.Date?.date?.start;
          if (!dateProp) {
            console.error(`No date found for page ${page.id}`);
            continue;
          }
          const date = new Date(dateProp).getTime();

          // Get description (optional)
          const descriptionProp = properties.Description?.rich_text?.[0]?.plain_text;

          // Create transaction via internal mutation
          const result = await ctx.runMutation(internal.notionSync.createTransactionFromNotion, {
            email: emailProp,
            cardName,
            amountInCents,
            category,
            date,
            description: descriptionProp,
            notionPageId: page.id,
          });

          results.push({ pageId: page.id, ...result });

          // Mark as synced in Notion if successful
          if (result.success) {
            await notion.pages.update({
              page_id: page.id,
              properties: {
                Synced: {
                  checkbox: true,
                },
              },
            });
          }
        } catch (error) {
          console.error(`Error processing page ${page.id}:`, error);
          results.push({ pageId: page.id, success: false, error: String(error) });
        }
      }

      return {
        success: true,
        synced: results.filter((r) => r.success).length,
        failed: results.filter((r) => !r.success).length,
        results,
      };
    } catch (error) {
      console.error("Error syncing from Notion:", error);
      return {
        success: false,
        error: String(error),
      };
    }
  },
});

// Public action to manually trigger sync (for UI button)
export const manualSync = action({
  args: {},
  handler: async (ctx): Promise<{
    success: boolean;
    synced?: number;
    failed?: number;
    results?: any[];
    error?: string;
  }> => {
    return await ctx.runAction(internal.notionSync.syncFromNotion);
  },
});
