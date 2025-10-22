/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as ResendWithHash from "../ResendWithHash.js";
import type * as auth from "../auth.js";
import type * as crons from "../crons.js";
import type * as http from "../http.js";
import type * as notionSync from "../notionSync.js";
import type * as seed from "../seed.js";
import type * as supportedCards from "../supportedCards.js";
import type * as transactions from "../transactions.js";
import type * as userCards from "../userCards.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  ResendWithHash: typeof ResendWithHash;
  auth: typeof auth;
  crons: typeof crons;
  http: typeof http;
  notionSync: typeof notionSync;
  seed: typeof seed;
  supportedCards: typeof supportedCards;
  transactions: typeof transactions;
  userCards: typeof userCards;
}>;
declare const fullApiWithMounts: typeof fullApi;

export declare const api: FilterApi<
  typeof fullApiWithMounts,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApiWithMounts,
  FunctionReference<any, "internal">
>;

export declare const components: {};
