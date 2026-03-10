import type { Metadata } from "next";
import "./globals.css";
import Navigation from "@/components/Navigation";
import PersistentPlayer from "@/components/PersistentPlayer";
import MainContent from "@/components/MainContent";

export const metadata: Metadata = {
  title: "Inno4Def 2.0",
  description: "AI-powered matchmaking platform connecting defense organizations with researchers and tech companies",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen bg-surface">
        <Navigation />
        <MainContent>{children}</MainContent>
        <PersistentPlayer />
      </body>
    </html>
  );
}
