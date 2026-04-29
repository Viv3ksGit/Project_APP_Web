import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const lora = localFont({
  src: [
    { path: "./fonts/lora-400.ttf", weight: "400", style: "normal" },
    { path: "./fonts/lora-500.ttf", weight: "500", style: "normal" },
    { path: "./fonts/lora-600.ttf", weight: "600", style: "normal" },
    { path: "./fonts/lora-700.ttf", weight: "700", style: "normal" },
  ],
  variable: "--font-lora",
  display: "swap",
});

const notoSerifTamil = localFont({
  src: [
    { path: "./fonts/noto-serif-tamil-400.ttf", weight: "400", style: "normal" },
    { path: "./fonts/noto-serif-tamil-500.ttf", weight: "500", style: "normal" },
    { path: "./fonts/noto-serif-tamil-600.ttf", weight: "600", style: "normal" },
    { path: "./fonts/noto-serif-tamil-700.ttf", weight: "700", style: "normal" },
  ],
  variable: "--font-tamil",
  display: "swap",
});

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
      <body className={`${lora.variable} ${notoSerifTamil.variable}`}>{children}</body>
    </html>
  );
}
