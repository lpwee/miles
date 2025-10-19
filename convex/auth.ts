import { convexAuth } from "@convex-dev/auth/server";
import ResendWithHash from "./ResendWithHash";

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [ResendWithHash],
});
