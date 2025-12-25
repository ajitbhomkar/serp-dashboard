import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SERP Keyword Ranking Dashboard",
  description: "Track your website's keyword rankings in search engines",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
