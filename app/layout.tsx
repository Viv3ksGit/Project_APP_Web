import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sloka Sabha",
  description: "Tamil and English sloka app for community chanting sessions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
