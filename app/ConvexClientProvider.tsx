"use client";

import { ConvexAuthNextjsProvider } from "@convex-dev/auth/nextjs";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ReactNode } from "react";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export default function ConvexClientProvider({
  children,
}: {
  children: ReactNode;
}) {
  // Temporarily using basic ConvexProvider due to ConvexAuthNextjsProvider error
  // TODO: Debug auth setup - possible React 19 compatibility issue
  return (
    <ConvexProvider client={convex}>
      {children}
    </ConvexProvider>
  );

  // Use this once auth is working:
  // return (
  //   <ConvexAuthNextjsProvider client={convex}>
  //     {children}
  //   </ConvexAuthNextjsProvider>
  // );
}