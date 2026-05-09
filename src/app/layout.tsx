import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import RootLayoutProvider from "@/providers/RootLayoutProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"]
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"]
});

export const metadata: Metadata = {
  title: "Huzaifa Dev Vault",
  description:
    "A focused knowledge base for reusable frontend code, prompts, and project guidance.",
  icons: {
    icon: [
      { url: "/favs/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/favs/favicon.svg", type: "image/svg+xml" },
      { url: "/favs/favicon.ico" }
    ],
    apple: [{ url: "/favs/apple-touch-icon.png", sizes: "180x180" }]
  },
  manifest: "/favs/site.webmanifest"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-zinc-950 text-zinc-100">
        <RootLayoutProvider>{children}</RootLayoutProvider>
      </body>
    </html>
  );
}
