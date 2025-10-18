import type { Metadata } from "next";
import { Lato } from "next/font/google";
import "./globals.css";
import "@uploadthing/react/styles.css";
import ConvexClientProvider from "./ConvexClientProvider";

const lato = Lato({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-lato",
});

export const metadata: Metadata = {
  title: "Miles Tracker",
  description: "Track your credit card miles",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${lato.variable} font-sans antialiased`}
        style={{ fontFamily: 'var(--font-lato)' }}
      >
        <ConvexClientProvider>{children}</ConvexClientProvider>
      </body>
    </html>
  );
}
