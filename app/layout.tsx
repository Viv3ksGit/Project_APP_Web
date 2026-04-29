import type { Metadata } from "next";
import { Lora, Noto_Serif_Tamil } from "next/font/google";
import "./globals.css";

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
  display: "swap",
});

const notoSerifTamil = Noto_Serif_Tamil({
  subsets: ["tamil"],
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
