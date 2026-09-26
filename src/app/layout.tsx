import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../style/globals.css"

const inter = Inter({
subsets: ["latin"],
variable: "--font-inter",
});

export const viewport = {
  width: "device-width",
  initialScale: 1,
  interactiveWidget: "resizes-content",
};

export const metadata: Metadata = {
  title: "Oggy | Kawsar Ahmed Ai Assistant",
  description: "Oggy is an intelligent AI assistant created by Kawsar Ahmed. Get instant answers, coding help, creative ideas, productivity support, and smart conversations powered by advanced AI technology.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>{children}</body>
    </html>
  );
}
