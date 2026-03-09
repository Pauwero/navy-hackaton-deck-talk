import type { Metadata } from "next";
import "./globals.css";
import Navigation from "@/components/Navigation";

export const metadata: Metadata = {
  title: "Naval Innovation Hub",
  description: "AI-powered matchmaking platform connecting naval organizations with researchers and tech companies",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-surface">
        <Navigation />
        <main className="max-w-6xl mx-auto px-4 py-6 pb-24 md:pb-6">{children}</main>
      </body>
    </html>
  );
}
