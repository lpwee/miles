import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

// Sync from Notion every 5 minutes
crons.interval(
  "sync from Notion",
  { minutes: 5 },
  internal.notionSync.syncFromNotion
);

export default crons;
